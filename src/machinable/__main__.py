"""Module entry point (``python -m machinable``).

Same entry point as the ``machinable`` script; used by serverless dispatch to
re-invoke itself as a detached child.
"""

import sys

from machinable.cli import main

if __name__ == "__main__":
    sys.exit(main())
