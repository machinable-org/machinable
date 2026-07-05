"""``machinable.Inference``: statistical inferences over interface results.

An ``Inference`` is an ``Interface``, parallel to ``Slurm(Execution)``:

* the **subclass** is the *question* (``Outperforms``, ``BeatsBaseline``, ``Ranks``);
* the **Config** is the *method* (``test``, ``alpha``, ``quantity``);
* the **operands** are the *subjects*, i.e. the interfaces being compared, supplied via
  :meth:`of` and folded into the predicate (by config identity) so the verdict's
  identity is ``method × operands``.

machinable ships only this contract. Concrete inferences, along with their statistics
(scipy/statsmodels), effect sizes, and any multiple-comparison correction, live in
the *implementation*, shareable like any interface. The operand exposes a plain
``<quantity>()`` accessor returning one run's atomic value; the inference collects it
across the operand's cached ``.interfaces`` runs. A missing accessor raises a
``NotImplementedError`` that names exactly what to implement. See the Inference guide
and the inference design notes in the machinable documentation.
"""

from __future__ import annotations

from typing import Any

from machinable.interface import Interface


class Inference(Interface):
    """A scientific question as an interface: the subclass is the question, the.

    ``Config`` is the method, and the operands (via :meth:`of`) are the subjects.
    """

    kind = "Inference"
    default = None
    # the atomic shape each operand's quantity() accessor yields per run:
    # "scalar" (one number) or "series" (a curve); the inference composes the sample.
    requires: str = "scalar"

    def __init__(
        self,
        version=None,
        uses=None,
        derived_from: Interface | None = None,
    ) -> None:
        super().__init__(version=version, uses=uses, derived_from=derived_from)
        self._operands: list[Interface] = []

    def of(self, *operands: Interface) -> Inference:
        """Bind the operand interfaces this inference operates on (the subjects)."""
        self._operands = list(operands)
        return self

    def on_compute_predicate(self) -> dict:
        # Operands identify this inference within its method class. Aggregates are
        # typically ephemeral (never materialized → no uuid), so reference them by
        # config identity, which is stable and computable without materialization.
        """Folds the operands (by config identity) into the verdict's identity."""
        return {"operands": [self._operand_id(o) for o in self._operands]}

    @staticmethod
    def _operand_id(operand: Interface) -> str:
        return operand.catalog_identity_key()

    def units(self, operand: Interface) -> list[Interface]:
        """The runs to measure for an operand.

        An aggregate exposes its grid via ``.interfaces`` (the deferred-``Execution``
        collection); we take the cached ones. A leaf operand is its own single unit.
        Overridable for operands that expose their runs differently.
        """
        runs = operand.interfaces.filter(lambda x: x.cached())
        return list(runs) if len(runs) else [operand]

    def resolve(self, operand: Interface) -> list:
        """Collect ``quantity()`` across the operand's units into a sample.

        Raises a contract-bearing ``NotImplementedError`` naming the accessor to
        implement when an operand does not expose it.
        """
        quantity = self.config.quantity
        units = self.units(operand)
        try:
            return [getattr(unit, quantity)() for unit in units]
        except (AttributeError, NotImplementedError) as miss:
            raise NotImplementedError(
                f"{operand.module} has no '{quantity}()' accessor. Implement "
                f"`def {quantity}(self)` returning this run's {self.requires} "
                f"(e.g. by sieving self.load_file(...)). The inference collects it "
                f"across the operand's {len(units)} replicate(s)."
            ) from miss

    def test(self, samples: list[list]) -> dict:
        """Compute the verdict from the resolved operand samples.

        Subclasses implement the statistic (bringing their own stats dependency)
        and return a JSON-able verdict dict (``claim``/``holds``/``p_value``/…).
        """
        raise NotImplementedError(
            "Inference subclasses must implement test(samples) -> verdict dict"
        )

    def __call__(self) -> dict:
        """Resolve the operand samples, compute the verdict, and persist it."""
        samples = [self.resolve(operand) for operand in self._operands]
        verdict: dict[str, Any] = dict(self.test(samples))
        verdict.setdefault("operands", [self._operand_id(o) for o in self._operands])
        self.save_file("verdict.json", verdict)
        return verdict

    def verdict(self) -> dict | None:
        """The saved verdict (after the inference has run), or ``None``."""
        return self.load_file("verdict.json", None)
