
# Command-line interface

Components can be launched directly from the command-line. The CLI works out of the box and closely mirrors the Python interface. To run a component, type its module name and method name, optionally followed by the configuration options, for example:
```bash
machinable mnist_data batch_size=4 --launch
```
To use multiprocessing, you may type:
```bash
machinable mnist_data batch_size=4 \
  multiprocess processes=4 --launch
```

### Creating aliases

Generally, your command lines will likely look like the following:
```sh
PYTHONPATH=.:$PYTHONPATH machinable get machinable.index directory=$STORAGE <interfaces here>
```
This specifies to save and load results in the `$STORAGE` directory and it's useful to add an alias for this to your `.bashrc`:
```sh
function ma { PYTHONPATH=.:$PYTHONPATH machinable get machinable.index directory=$STORAGE "$@"; }
```
so you can type
```sh
ma <interfaces here>
```

Note that `.<path>` is a shorthand for `interface.<path>`, e.g. typing `interface.example` is equivalent to `.example`.

