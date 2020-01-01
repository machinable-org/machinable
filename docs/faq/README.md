---
sidebar: auto
---

# FAQ

## Why do I have to change into the machinable project directory before running it?

This has to do with how Python's import system handles relative imports with respect to the current working directory. As a result, the two following lines are not necessarily identical as the Python script may contain import statement that rely on the current working directory.

```bash
python example/main.py
cd example && python main.py
```

To ensure that import dependencies are resolved correctly, machinable enforces execution from the project's root. 


<br>