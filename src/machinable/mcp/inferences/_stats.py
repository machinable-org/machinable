"""Small statistics helpers for the reference inferences.

machinable core ships *no* statistics; these live with the reference inferences
(the design's "the inference brings its own stats"). They lean on scipy, imported
lazily so the catalog can list an inference without scipy installed.
"""

from __future__ import annotations

import math


def cohens_d(a: list[float], b: list[float]) -> float:
    """Standardised mean difference (pooled SD)."""
    na, nb = len(a), len(b)
    if na < 2 or nb < 2:
        return float("nan")
    ma, mb = sum(a) / na, sum(b) / nb
    va = sum((x - ma) ** 2 for x in a) / (na - 1)
    vb = sum((x - mb) ** 2 for x in b) / (nb - 1)
    pooled = ((na - 1) * va + (nb - 1) * vb) / (na + nb - 2)
    sd = math.sqrt(pooled)
    if sd == 0:
        return 0.0 if ma == mb else math.inf
    return (ma - mb) / sd


_ALT = {"greater": "greater", "less": "less", "two-sided": "two-sided"}


def two_sample(a, b, *, test: str, tail: str) -> tuple[float, float]:
    """``(statistic, p_value)`` for a two-sample test (welch/student/mannwhitney)."""
    from scipy import stats

    alt = _ALT[tail]
    if test == "welch":
        res = stats.ttest_ind(a, b, equal_var=False, alternative=alt)
    elif test == "student":
        res = stats.ttest_ind(a, b, equal_var=True, alternative=alt)
    elif test == "mannwhitney":
        res = stats.mannwhitneyu(a, b, alternative=alt)
    else:
        raise ValueError(f"unknown test {test!r} (welch|student|mannwhitney)")
    return float(res.statistic), float(res.pvalue)


def one_sample(a, baseline: float, *, tail: str) -> tuple[float, float]:
    """``(statistic, p_value)`` for a one-sample t-test against ``baseline``."""
    from scipy import stats

    res = stats.ttest_1samp(a, baseline, alternative=_ALT[tail])
    return float(res.statistic), float(res.pvalue)


def reduce_curve(curve, *, summary: str, threshold: float) -> float:
    """Reduce a convergence curve to a scalar.

    ``curve`` is a list of values (step = index) or ``[step, value]`` pairs.
    ``summary``: ``auc`` (trapezoidal area) or ``steps_to_threshold`` (first step
    reaching ``threshold``; ``inf`` if never).
    """
    steps, values = [], []
    for i, point in enumerate(curve):
        if isinstance(point, (list, tuple)) and len(point) == 2:
            steps.append(float(point[0]))
            values.append(float(point[1]))
        else:
            steps.append(float(i))
            values.append(float(point))
    if not values:
        return math.nan
    if summary == "auc":
        area = 0.0
        for i in range(1, len(values)):
            area += (steps[i] - steps[i - 1]) * (values[i] + values[i - 1]) / 2
        return area
    if summary == "steps_to_threshold":
        for s, v in zip(steps, values):
            if v <= threshold:
                return s
        return math.inf
    raise ValueError(f"unknown summary {summary!r} (auc|steps_to_threshold)")
