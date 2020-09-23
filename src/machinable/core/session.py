_SESSION = {}


def get(key):
    if key not in ["component", "store", "config", "flags", "log", "record"]:
        raise ValueError(f"Invalid request: {key}")

    component = _SESSION.get("component", None)

    if key == "component":
        return component

    return getattr(component, key, None)
