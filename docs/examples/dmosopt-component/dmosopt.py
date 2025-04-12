from machinable import Component
from machinable.interface import cachable
from mpi4py import MPI
from pydantic import BaseModel, ConfigDict, Field, field_validator, TypeAdapter
from dmosopt import dmosopt
from dmosopt import config
from machinable.config import to_dict
from typing import Dict, Optional, List, Callable, Literal, Set, Any, Union, Tuple
from numbers import Number
import copy
from machinable.config import match_method
import os
import sys
import inspect
import h5py
from dmosopt.MOASMO import get_best, epsilon_get_best
from dmosopt import indicators
import numpy as np
import pandas as pd
import datetime
import distwq


sys_excepthook = sys.excepthook


def mpi_excepthook(type, value, traceback):
    sys_excepthook(type, value, traceback)
    sys.stdout.flush()
    sys.stderr.flush()
    if MPI.COMM_WORLD.size > 1:
        MPI.COMM_WORLD.Abort(1)


sys.excepthook = mpi_excepthook


class Dmosopt(Component):
    class Config(BaseModel):
        model_config = ConfigDict(extra="forbid")

        dopt_params: Dict = Field("???")
        time_limit: Optional[int] = None
        feasible: bool = True
        return_features: bool = False
        return_constraints: bool = False
        spawn_workers: bool = False
        sequential_spawn: bool = False
        spawn_startup_wait: Optional[int] = None
        spawn_executable: Optional[str] = None
        spawn_args: List[str] = []
        nprocs_per_worker: int = 1
        collective_mode: Literal["gather", "sendrecv"] = "gather"
        verbose: bool = True
        worker_debug: bool = False
        nodes: Optional[str] = None
        ranks: Optional[int] = None

        @field_validator("dopt_params", mode="before")
        @classmethod
        def valid_optimization_settings(cls, params: Dict) -> Dict:
            _t = {
                "opt_id": str,
                "obj_fun_name": Optional[str],
                "obj_fun_init_name": Optional[str],
                "obj_fun_init_args": Dict,
                "controller_init_fun_name": Optional[str],
                "controller_init_fun_args": Dict,
                "reduce_fun_name": Optional[str],
                "reduce_fun_args": Union[List, Tuple],
                "broker_fun_name": Optional[str],
                "broker_module_name": Optional[str],
                # DistOptimizer
                "objective_names": Union[str, List[str]],
                "feature_dtypes": str,
                "constraint_names": Union[str, List[str]],
                "n_initial": int,
                "initial_maxiter": int,
                "initial_method": Union[
                    Callable,
                    Literal["glp", "slh", "lh", "mc", "sobol"],
                    Dict[str, Any],
                    str,
                ],
                "dynamic_initial_sampling": Optional[str],
                "dynamic_initial_sampling_kwargs": Optional[Dict],
                "verbose": bool,
                "problem_ids": Optional[Set],
                "problem_parameters": Optional[Dict],
                "space": Optional[
                    Dict[str, Tuple[Union[int, float], Union[int, float]]]
                ],
                "population_size": int,
                "num_generations": int,
                "resample_fraction": float,
                "distance_metric": Union[Callable, Literal["crowding", "euclidean"]],
                "n_epochs": int,
                "save_eval": bool,
                "file_path": Optional[str],
                "save": bool,
                "save_surrogate_evals": bool,
                "save_optimizer_params": bool,
                "metadata": Any,
                "surrogate_method_name": Union[
                    str,
                    Literal[
                        "gpr",
                        "egp",
                        "megp",
                        "mdgp",
                        "mdspp",
                        "vgp",
                        "svgp",
                        "spv",
                        "siv",
                        "crv",
                    ],
                    None,
                ],
                "surrogate_method_kwargs": Dict,
                "surrogate_custom_training": Optional[str],
                "surrogate_custom_training_kwargs": Optional[Dict],
                "optimizer_name": Union[Literal["nsga2", "age", "smpso", "cmaes"], str],
                "optimizer_kwargs": Union[Dict, List[Dict]],
                "sensitivity_method_name": Literal["dgsm", "fast"],
                "sensitivity_method_kwargs": Dict,
                "local_random": Any,
                "random_seed": Optional[int],
                "feasibility_method_name": Optional[str],
                "feasibility_method_kwargs": Dict,
                "termination_conditions": Union[bool, Dict, None],
                #
                "di_crossover": Any,  #
                "di_mutation": Any,  #
            }

            payload = copy.deepcopy(to_dict(params))
            for k, v in payload.items():
                if k == "feature_names":
                    raise ValueError("Use feature_dtypes instead of feature_names")
                if k not in _t:
                    raise ValueError(f"Invalid option: {k}")
                if isinstance(v, str) and match_method(v):
                    # config method allowed
                    continue
                try:
                    TypeAdapter(_t[k]).validate_python(v)
                except Exception as _ex:
                    print(v)
                    raise ValueError(
                        f"Invalid type for '{k}'; expected {_t[k]} but got:"
                    ) from _ex

            # additional rules
            if (payload.get("random_seed", None) is not None) and (
                payload.get("local_random", None) is not None
            ):
                raise ValueError(
                    "Both random_seed and local_random are specified! Only one or the other must be specified."
                )

            # validate imports eagerly
            for path, alias, kw in [
                ("obj_fun_name", {}, None),
                ("obj_fun_init_name", {}, "obj_fun_init_args"),
                ("controller_init_fun_name", {}, "controller_init_fun_args"),
                ("reduce_fun_name", {}, None),
                ("broker_fun_name", {}, None),
                ("initial_method", config.default_sampling_methods, None),
                ("dynamic_initial_sampling", {}, "dynamic_initial_sampling_kwargs"),
                (
                    "surrogate_method_name",
                    config.default_surrogate_methods,
                    "surrogate_method_kwargs",
                ),
                (
                    "feasibility_method_name",
                    config.default_feasibility_methods,
                    "feasibility_method_kwargs",
                ),
                ("surrogate_custom_training", {}, "surrogate_custom_training_kwargs"),
                ("optimizer_name", config.default_optimizers, None),
                (
                    "sensitivity_method_name",
                    config.default_sa_methods,
                    "sensitivity_method_kwargs",
                ),
                ("feature_dtypes", {}, None),
                ("objective_names", {}, None),
                ("constraint_names", {}, None),
                ("metadata", {}, None),
            ]:
                if isinstance(target := payload.get(path, None), str):
                    if target in alias:
                        target = alias[target]
                    try:
                        obj = config.import_object_by_path(target)
                    except ImportError as _ex:
                        raise ValueError(
                            f"Could not resolve import path '{target}' for '{path}': {_ex}"
                        ) from _ex

                    if (d := payload.get(kw, None)) is not None:
                        # verify arguments
                        sig = inspect.signature(obj)
                        if any(
                            [
                                True
                                for p in sig.parameters.values()
                                if p.kind == p.VAR_KEYWORD
                            ]
                        ):
                            # if function accepts keyword arguments, we cannot validate :-(
                            continue

                        for key in d.keys():
                            if key not in sig.parameters:
                                message = ""
                                for name, param in sig.parameters.items():
                                    if param.default is param.empty:
                                        message += f"{name}, "
                                    else:
                                        message += f"{name}={param.default}, "
                                raise ValueError(
                                    f"Invalid {kw} for {target}. Found `{key}`, but signature is {message[:-2]}"
                                )
            # rewrite the default surrogate_method_name to None
            #  if surrogate_custom_training is specified, we can't
            #  know from the configuration if the surrogate method
            #  is used or not. We thus assume by convention that
            #  it is used iff surrogate_method_name is overriden
            if "surrogate_method_name" not in payload:
                payload["surrogate_method_name"] = None

            return payload

    def on_before_commit(self):
        # pre-flight callable check
        params = to_dict(self.config.dopt_params)
        for f in [
            "feature_dtypes",
            "objective_names",
            "constraint_names",
            "metadata",
        ]:
            if f in params and isinstance(params[f], str):
                fi = config.import_object_by_path(params[f])
                if callable(fi):
                    fi = fi(self)

    def __call__(self) -> None:
        if MPI.COMM_WORLD.Get_rank() == 0:
            params = to_dict(self.config.dopt_params)
            if "file_path" not in params:
                params["file_path"] = self.output_filepath
            if "local_random" not in params and "random_seed" not in params:
                params["random_seed"] = self.seed
            for f in [
                "feature_dtypes",
                "objective_names",
                "constraint_names",
                "metadata",
            ]:
                # users may specify these fields in terms of importable objects
                #  to avoid repetition or use custom types
                if f in params and isinstance(params[f], str):
                    fi = config.import_object_by_path(params[f])
                    if callable(fi):
                        fi = fi(self)
                    params[f] = fi
            params = MPI.COMM_WORLD.bcast(params, root=0)
        else:
            params = MPI.COMM_WORLD.bcast(None, root=0)

        run = dmosopt.run(
            dopt_params=params,
            time_limit=self.config.time_limit,
            feasible=self.config.feasible,
            return_features=self.config.return_features,
            return_constraints=self.config.return_constraints,
            spawn_workers=self.config.spawn_workers,
            sequential_spawn=self.config.sequential_spawn,
            spawn_startup_wait=self.config.spawn_startup_wait,
            spawn_executable=self.config.spawn_executable,
            spawn_args=self.config.spawn_args,
            nprocs_per_worker=self.config.nprocs_per_worker,
            collective_mode=self.config.collective_mode,
            verbose=self.config.verbose,
            worker_debug=self.config.worker_debug,
        )

        if MPI.COMM_WORLD.Get_rank() != getattr(distwq, "controller_rank", 0):
            return

        try:
            self.save_file("run.p", run)
        except:
            pass

    def parameter_vector_to_dict(self, x, include_constants=True):
        constants = {}
        if include_constants:
            constants = self.config.dopt_params.problem_parameters
        return {
            **constants,
            **{k: x[n] for n, k in enumerate(self.config.dopt_params.space.keys())},
        }

    def evaluate_objective_at(self, x):
        import logging

        p = x
        if not isinstance(p, dict):
            p = self.parameter_vector_to_dict(x)

        logging.basicConfig(level=logging.INFO)
        if "obj_fun_init_name" in self.config.dopt_params:
            obj_fun = config.import_object_by_path(
                self.config.dopt_params.obj_fun_init_name
            )(**self.config.dopt_params.obj_fun_init_args)
        else:
            obj_fun = config.import_object_by_path(self.config.dopt_params.obj_fun_name)

        return obj_fun(p)

    def evaluate_objective_at_many(self, samples, processes=None):
        if processes is False:
            return [self.evaluate_objective_at(x) for x in samples]

        import multiprocessing

        if processes is None:
            processes = multiprocessing.cpu_count() - 1

        with multiprocessing.Pool(processes=processes) as pool:
            return pool.map(self.evaluate_objective_at, samples)

    def bounds_normalize(self, x):
        q = np.zeros_like(x)
        for i in range(x.shape[-1]):
            q[:, i] = (x[:, i] - self.xlb[i]) / (self.xub[i] - self.xlb[i])
        return q

    @property
    def output_filepath(self) -> str:
        return os.path.abspath(self.local_directory("dmosopt.h5"))

    def on_write_meta_data(self):
        return MPI.COMM_WORLD.Get_rank() == getattr(distwq, "controller_rank", 0)

    def on_commit(self):
        if MPI.COMM_WORLD.Get_rank() != getattr(distwq, "controller_rank", 0):
            return False

    @cachable(file=False)
    def load_h5(
        self,
        filepath: Optional[str] = None,
        opt_id: Optional[str] = None,
        problem_id: int = 0,
    ):
        if filepath is None:
            filepath = self.output_filepath

        if opt_id is None:
            opt_id = self.config.dopt_params.opt_id

        with h5py.File(filepath, "r") as h5:
            # constraints
            if f"{opt_id}/constraint_enum" in h5:
                constraint_enum = h5py.check_enum_dtype(
                    h5[f"{opt_id}/constraint_enum"].dtype
                )
                constraint_enum_T = {v: k for k, v in constraint_enum.items()}
                constraint_names = [
                    constraint_enum_T[s[0]]
                    for s in iter(h5[f"{opt_id}/constraint_spec"])
                ]
                constraints = pd.DataFrame(
                    h5[f"{opt_id}/{problem_id}/constraints"][:],
                    columns=constraint_names,
                )
                if self.constraint_names:
                    constraints = constraints[
                        self.constraint_names
                    ]  # sort for consistency
            else:
                constraints = None

            # epochs
            epochs = h5[f"{opt_id}/{problem_id}/epochs"][:]

            # features
            if f"{opt_id}/feature_enum" in h5:
                feature_enum = h5py.check_enum_dtype(h5[f"{opt_id}/feature_enum"].dtype)
                feature_enum_T = {v: k for k, v in feature_enum.items()}
                feature_names = [
                    feature_enum_T[s[0]] for s in iter(h5[f"{opt_id}/feature_spec"])
                ]
                features = pd.DataFrame(
                    [
                        list(feature)
                        for feature in h5[f"{opt_id}/{problem_id}/features"]
                    ],
                    columns=feature_names,
                )
                if self.feature_names:
                    features = features[self.feature_names]  # sort for consistency
            else:
                features = None

            # objectives
            objective_enum = h5py.check_enum_dtype(h5[f"{opt_id}/objective_enum"].dtype)
            objective_enum_T = {v: k for k, v in objective_enum.items()}
            objective_names = [
                objective_enum_T[s[0]] for s in iter(h5[f"{opt_id}/objective_spec"])
            ]
            objectives = pd.DataFrame(
                h5[f"{opt_id}/{problem_id}/objectives"][:], columns=objective_names
            )
            if self.objective_names:
                objectives = objectives[self.objective_names]  # sort for consistency

            # parameters
            parameter_enum = h5py.check_enum_dtype(h5[f"{opt_id}/parameter_enum"].dtype)
            parameter_enum_T = {v: k for k, v in parameter_enum.items()}
            parameter_names = [
                parameter_enum_T[s[0]] for s in iter(h5[f"{opt_id}/parameter_spec"])
            ]
            parameters = pd.DataFrame(
                h5[f"{opt_id}/{problem_id}/parameters"][:], columns=parameter_names
            )
            # order such that it stays consistent with the space definition
            parameters = parameters[list(self.config.dopt_params.space.keys())]

            # predictions
            predictions = pd.DataFrame(
                h5[f"{opt_id}/{problem_id}/predictions"][:], columns=objective_names
            )
            if self.objective_names:
                predictions = predictions[self.objective_names]  # sort for consistency

            # metadata
            metadata = None
            if f"/{opt_id}/metadata" in h5:
                metadata = h5[f"/{opt_id}/metadata"][:]

        return {
            "constraints": constraints,
            "epochs": epochs,
            "features": features,
            "objectives": objectives,
            "parameters": parameters,
            "predictions": predictions,
            "metadata": metadata,
        }

    def load_h5_arrays(
        self,
        include="xyc",
        region: list | tuple | None = None,
        filepath: Optional[str] = None,
        opt_id: Optional[str] = None,
        problem_id: int = 0,
    ):
        mask = slice(None)
        if isinstance(region, (list, tuple)):
            mask = slice(*region)
        elif isinstance(region, slice):
            mask = region

        data = self.load_h5(filepath, opt_id, problem_id)

        result = []
        for i in include:
            if i.lower() == "x":
                q = data["parameters"].to_numpy()[mask]
                if i == "X":
                    q = self.bounds_normalize(q)
            elif i == "y":
                q = data["objectives"].to_numpy()[mask]
            elif i == "f":
                q = None
                if data["features"] is not None:
                    q = data["features"].to_numpy()[mask]
            elif i == "c":
                q = None
                if data["constraints"] is not None:
                    q = (data["constraints"].to_numpy() > 0).astype(int)[mask]
            elif i == "p":
                q = data["predictions"].to_numpy()[mask]
            else:
                raise ValueError(f"Invalid include '{i}'")
            result.append(q)

        return tuple(result)

    @cachable(file=False)
    def load_h5_optimizer_data(
        self, filepath: Optional[str] = None, opt_id: Optional[str] = None
    ):
        if filepath is None:
            filepath = self.output_filepath

        if opt_id is None:
            opt_id = self.config.dopt_params.opt_id

        with h5py.File(filepath, "r") as h5:
            stats = None
            if f"/{opt_id}/optimizer_stats" in h5:
                epoch = 0 if f"/{opt_id}/optimizer_stats/0" in h5 else 1
                stats = []
                while True:
                    if f"/{opt_id}/optimizer_stats/{epoch}" not in h5:
                        break

                    epoch_stats = h5[f"/{opt_id}/optimizer_stats/{epoch}/stats"]
                    stats.append(
                        {
                            n: v
                            for n, v in zip(epoch_stats[0].dtype.names, epoch_stats[0])
                        }
                    )

                    epoch += 1
                stats = pd.DataFrame(stats)

            params = None
            if f"/{opt_id}/optimizer_params" in h5:
                epoch = 1
                params = []
                while True:
                    if f"/{opt_id}/optimizer_params/{epoch}" not in h5:
                        break

                    epoch_params = h5[f"/{opt_id}/optimizer_params/{epoch}"]
                    row = {"epoch": epoch}
                    for dset in epoch_params:
                        row[dset] = epoch_params[dset][()]
                    params.append(row)

                    epoch += 1

                params = pd.DataFrame(params)

        return {"stats": stats, "params": params}

    @cachable(file=False)
    def load_h5_surrogate_evals(
        self,
        filepath: Optional[str] = None,
        opt_id: Optional[str] = None,
        problem_id: int = 0,
    ):
        if filepath is None:
            filepath = self.output_filepath

        if opt_id is None:
            opt_id = self.config.dopt_params.opt_id

        with h5py.File(filepath, "r") as h5:
            epochs = None
            if f"/{opt_id}/surrogate_evals/epochs" in h5:
                epochs = h5[f"/{opt_id}/surrogate_evals/epochs"][:]

            generations = None
            if f"/{opt_id}/surrogate_evals/generations" in h5:
                generations = h5[f"/{opt_id}/surrogate_evals/generations"][:]

            objectives = None
            if f"/{opt_id}/surrogate_evals/objectives" in h5:
                objective_enum = h5py.check_enum_dtype(
                    h5[f"{opt_id}/objective_enum"].dtype
                )
                objective_enum_T = {v: k for k, v in objective_enum.items()}
                objective_names = [
                    objective_enum_T[s[0]] for s in iter(h5[f"{opt_id}/objective_spec"])
                ]
                objectives = pd.DataFrame(
                    h5[f"/{opt_id}/surrogate_evals/objectives"][:],
                    columns=objective_names,
                )

            parameters = None
            if f"/{opt_id}/surrogate_evals/parameters" in h5:
                parameter_enum = h5py.check_enum_dtype(
                    h5[f"{opt_id}/parameter_enum"].dtype
                )
                parameter_enum_T = {v: k for k, v in parameter_enum.items()}
                parameter_names = [
                    parameter_enum_T[s[0]] for s in iter(h5[f"{opt_id}/parameter_spec"])
                ]
                parameters = pd.DataFrame(
                    h5[f"/{opt_id}/surrogate_evals/parameters"][:],
                    columns=parameter_names,
                )

        return {
            "epochs": epochs,
            "generations": generations,
            "objectives": objectives,
            "parameters": parameters,
        }

    def infer_num_initial_samples(self, problem_id: int = 0) -> int:
        with h5py.File(self.output_filepath, "r") as h5:
            epochs = h5[f"{self.config.dopt_params.opt_id}/{problem_id}/epochs"][:]

        self.inferred_num_initial_samples = len(epochs[epochs == 0])

        return self.inferred_num_initial_samples

    @cachable()
    def get_best(
        self,
        region: list | tuple | None = None,
        sort_by: str = "-np.std(y, axis=1)",
        as_dataframes: bool = True,
        epsilon=None,
    ):
        data = self.load_h5()

        if region is None:
            if len(data["epochs"]) > 5000:
                # optimize for speed since best solutions will be found in the last epochs
                region = slice(-5000, None)
            else:
                region = slice(None)
        else:
            region = slice(*region)

        objectives = data["objectives"].to_numpy()[region]

        valid = np.logical_not(np.any(np.isnan(objectives), axis=1))

        y = objectives[valid]
        x = data["parameters"].to_numpy()[region][valid]
        if data["constraints"] is not None:
            C = data["constraints"].to_numpy()[region][valid]
        else:
            C = None
        if data["features"] is not None:
            f = data["features"].to_numpy()[region][valid]
        else:
            f = None
        epochs = data["epochs"][region][valid]

        if epsilon is not None or len(x) == 0:
            best_x, best_y, best_f, best_c, eps = epsilon_get_best(
                x, y, f, C, epsilons=epsilon
            )
            best_epoch = None
        else:
            # strict non-dominated sort
            best_x, best_y, best_f, best_c, best_epoch, perm = get_best(
                x, y, f, C, None, None, epochs=epochs
            )

        if isinstance(sort_by, str):
            if len(best_x) > 0:
                context = {
                    "reduced": None,
                    "x": best_x,
                    "y": best_y,
                    "f": best_f,
                    "c": best_c,
                    "epochs": best_epoch,
                    "np": np,
                }
                exec(f"reduced={sort_by}", context)
                sort_by = np.argsort(context["reduced"])
            else:
                sort_by = None

        best = {"x": best_x, "y": best_y, "f": best_f, "c": best_c, "epoch": best_epoch}

        # apply sort
        if sort_by is not None:
            for k in best.keys():
                if best[k] is not None:
                    best[k] = best[k][sort_by]

        if as_dataframes:
            best["x"] = pd.DataFrame(best["x"], columns=data["parameters"].columns)
            best["y"] = pd.DataFrame(best["y"], columns=data["objectives"].columns)
            if best["f"] is not None:
                best["f"] = pd.DataFrame(best["f"], columns=data["features"].columns)
            if best["c"] is not None:
                best["c"] = pd.DataFrame(best["c"], columns=data["constraints"].columns)
            if best["epoch"] is not None:
                best["epoch"] = pd.DataFrame(best["epoch"], columns=["epoch"])

        return best

    def front(self, pf=None):
        if pf is None:
            return self.get_best()["y"].to_numpy()
        elif isinstance(pf, pd.DataFrame):
            return pf.to_numpy()
        elif isinstance(pf, pd.Series):
            return pf.to_numpy()
        elif isinstance(pf, Dmosopt):
            return pf.get_best()["y"].to_numpy()
        else:
            return np.array(pf)

    def norm_front(self, pf, min_max=None):
        pf = self.front(pf)

        if not isinstance(min_max, (list, tuple)):
            fmin, fmax = np.min(pf, axis=0), np.max(pf, axis=1)
        else:
            fmin, fmax = np.array(min_max[0]), np.array(min_max[1])

        return (pf - fmin) / (fmax - fmin + 1e-8)

    def igd(self, ref_front, pf=None):
        ref_front, pf = self.front(ref_front), self.front(pf)

        indicator = indicators.IGD(np.array(pf))

        return indicator.do(np.array(ref_front))

    @cachable()
    def hypervolume(self, ref_point, pf=None, normalize=False):
        if normalize:
            pf = self.norm_front(pf, normalize)
        else:
            pf = self.front(pf)

        indicator = indicators.Hypervolume(np.array(ref_point))

        return indicator.do(np.array(pf))

    def norm_hv(self, nadir, pf=None):
        return self.hypervolume(
            ref_point=[1.1] * len(nadir),
            pf=pf,
            normalize=[[0.0] * len(nadir), nadir],
        )

    def norm_hv_region(self, nadir, region):
        if region[1] > 5000:
            # optimize for speed
            region = [region[1] - 5000, region[1]]
        pf = self.get_best(region=list(region))["y"].to_numpy().tolist()
        return self.norm_hv(nadir, pf=pf)

    def norm_hv_epochs(self, nadir, from_zero=True):
        return [
            self.norm_hv_region(nadir, region)
            for region in self.epoch_ranges(from_zero=from_zero)
        ]

    def c_metric(self, ref_front, pf=None):
        """
        Calculates the set coverage of A over B, i.e. C(A, B),
        which is the fraction of solutions in B that are
        dominated by at least one solution in A.

        ref_front: B front array
        pf: A front array
        """
        ref_front, pf = self.front(ref_front), self.front(pf)

        coverage_count = 0
        for candidate in ref_front:
            for solution in pf:
                # solution dominates candidate?
                if all(r <= c for r, c in zip(solution, candidate)) and any(
                    r < c for r, c in zip(solution, candidate)
                ):
                    coverage_count += 1
                    break
        return coverage_count / len(ref_front)

    @property
    def dc(self):
        return self.config.dopt_params

    @property
    def parameter_names(self) -> list[str]:
        return list(self.config.dopt_params.space.keys())

    @property
    def constraint_names(self) -> list[str]:
        cn = self.config.dopt_params.get("constraint_names", [])
        if isinstance(cn, str):
            cn = config.import_object_by_path(cn)
            if callable(cn):
                cn = cn(self)
        return cn

    @property
    def num_constraints(self) -> int:
        return len(self.constraint_names)

    @property
    def objective_names(self) -> list[str]:
        on = self.config.dopt_params.get("objective_names", [])
        if isinstance(on, str):
            on = config.import_object_by_path(on)
            if callable(on):
                on = on(self)
        return on

    @property
    def num_objectives(self) -> int:
        return len(self.objective_names)

    @property
    def feature_names(self) -> list[str]:
        return [f[0] for f in self.feature_dtypes]

    @property
    def feature_dtypes(self) -> list[str]:
        fn = self.config.dopt_params.get("feature_dtypes", [])
        if isinstance(fn, str):
            fn = config.import_object_by_path(fn)
            if callable(fn):
                fn = fn(self)
        return fn

    @property
    def resample_fraction(self) -> float:
        return self.config.dopt_params.get("resample_fraction", 0.25)

    @property
    def population_size(self) -> int:
        return self.config.dopt_params.get("population_size", 100)

    @property
    def surrogate_method_name(self) -> str:
        return self.config.dopt_params.get("surrogate_method_name", "gpr")

    @property
    def initial_method(self) -> str:
        return self.config.dopt_params.get("initial_method", "slh")

    @property
    def num_generations(self) -> int:
        return self.config.dopt_params.get("num_generations", 200)

    @property
    def n_epochs(self) -> int:
        return self.config.dopt_params.get("n_epochs", 10)

    @property
    def n_initial(self) -> int:
        return self.config.dopt_params.get("n_initial", 10)

    @property
    def num_features(self) -> int:
        return len(self.feature_names)

    @property
    def num_parameters(self) -> int:
        return len(self.space)

    @property
    def num_initial_samples(self) -> int:
        if self.config.dopt_params.get("dynamic_initial_sampling", None) is not None:
            n_initial = getattr(self, "inferred_num_initial_samples", None)
            if n_initial is None:
                return self.infer_num_initial_samples()
            else:
                return n_initial

        return self.n_initial * self.num_parameters

    @property
    def num_resample(self) -> int:
        return int(self.resample_fraction * self.population_size)

    @property
    def num_evals_per_epoch(self) -> int:
        if (
            self.surrogate_method_name is None
            and self.config.dopt_params.get("surrogate_custom_training", None) is None
        ):
            return self.population_size * self.num_generations + self.num_resample

        return self.num_resample

    @property
    def num_evals_total(self) -> int:
        # n_epochs - 1 since epoch 0 is using the initial sampling, so there are no additional evals
        return self.num_initial_samples + (self.n_epochs - 1) * self.num_evals_per_epoch

    @property
    def num_max_surrogate_evals(self) -> int:
        if (
            self.surrogate_method_name is None
            and self.config.dopt_params.get("surrogate_custom_training", None) is None
        ):
            return 0

        evals = 0
        for epoch in range(1, self.n_epochs - 1):
            # initial sampling
            evals += self.num_initial_samples
            evals += self.population_size * epoch
            # generation
            evals += self.population_size * (self.num_generations + 1)

        return evals

    @property
    def space(self) -> dict[str, Tuple[Number, Number]]:
        return self.config.dopt_params.get("space", {})

    @property
    def xub(self) -> list[Number]:
        return [v[1] for v in self.space.values()]

    @property
    def xlb(self) -> list[Number]:
        return [v[0] for v in self.space.values()]

    def epoch_ranges(self, inferred=True, from_zero=False):
        if not inferred:
            return [
                (0, self.num_initial_samples),
            ] + [
                (
                    (
                        int(self.num_initial_samples + (self.num_evals_per_epoch * e))
                        if not from_zero
                        else 0
                    ),
                    self.num_initial_samples + (self.num_evals_per_epoch * (e + 1)),
                )
                for e in range(self.n_epochs - 1)
            ]

        epoch_array = self.load_h5()["epochs"]
        change_indices = np.where(np.diff(epoch_array) != 0)[0] + 1
        all_indices = np.concatenate(([0], change_indices, [len(epoch_array)]))
        return [
            (int(all_indices[i]) if not from_zero else 0, int(all_indices[i + 1]))
            for i in range(len(all_indices) - 1)
        ]

    def estimate_run_time(self, eval_seconds, surrogate_eval_seconds=None):
        seconds = self.num_evals_total * eval_seconds
        if surrogate_eval_seconds is not None:
            seconds += self.num_max_surrogate_evals * surrogate_eval_seconds
        return datetime.timedelta(seconds=seconds)

    def h5_config_consistency(self) -> list[tuple[str, Number, Number]]:
        inconsistencies = []

        data = self.load_h5()

        # num_features
        if self.num_features == 0:
            if data["features"] is not None:
                inconsistencies.append(
                    ("num_features", self.num_features, data["features"].shape[1])
                )
        elif self.num_features != data["features"].shape[1]:
            inconsistencies.append(
                ("num_features", self.num_features, data["features"].shape[1])
            )
            if self.feature_names != data["features"].columns.tolist():
                inconsistencies.append(
                    (
                        "feature_names",
                        self.feature_names,
                        data["features"].columns.tolist(),
                    )
                )

        # num_constraints
        if self.num_constraints == 0:
            if data["constraints"] is not None:
                inconsistencies.append(
                    (
                        "num_constraints",
                        self.num_constraints,
                        data["constraints"].shape[1],
                    )
                )
        elif self.num_constraints != data["constraints"].shape[1]:
            inconsistencies.append(
                ("num_constraints", self.num_constraints, data["constraints"].shape[1])
            )
            if self.constraint_names != data["constraints"].columns.tolist():
                inconsistencies.append(
                    (
                        "constraint_names",
                        self.constraint_names,
                        data["constraints"].columns.tolist(),
                    )
                )

        # num_parameters
        if self.num_parameters != data["parameters"].shape[1]:
            inconsistencies.append(
                ("num_parameters", self.num_parameters, data["parameters"].shape[1])
            )
            if (
                self.config.dopt_params.space.keys()
                != data["parameters"].columns.tolist()
            ):
                inconsistencies.append(
                    (
                        "parameter_names",
                        self.config.dopt_params.space.keys(),
                        data["parameters"].columns.tolist(),
                    )
                )

        # num_evals_total
        if self.num_evals_total != len(data["epochs"]):
            inconsistencies.append(
                ("num_evals_total", self.num_evals_total, len(data["epochs"]))
            )

        return inconsistencies
