import os

from machinable.utils.system import OutputRedirection


def test_output_redirection(capsys, helpers):
    for mode in ["SYS_AND_FILE", "FILE_ONLY", "DISCARD"]:
        storage = helpers.tmp_directory("output_redirection")

        print("non-captured")
        OutputRedirection.apply(
            mode, file_open=open, file_name=os.path.join(storage, "output.log")
        )
        print("captured")
        OutputRedirection.revert()
        print("non-captured-again")
        if mode == "DISCARD":
            assert not os.path.isfile(os.path.join(storage, "output.log"))
        else:
            with open(os.path.join(storage, "output.log"), "r") as f:
                assert f.read() == "captured\n"

        assert (
            capsys.readouterr().out
            == {
                "SYS_AND_FILE": "non-captured\ncaptured\nnon-captured-again\n",
                "FILE_ONLY": "non-captured\nnon-captured-again\n",
                "DISCARD": "non-captured\nnon-captured-again\n",
            }[mode]
        )
