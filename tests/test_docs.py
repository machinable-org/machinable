from typing import Optional, Tuple

import os

from machinable import Project
from machinable.utils import import_from_directory


def _parse_code_string(code_string: str) -> tuple[Optional[str], Optional[str]]:
    code_string = code_string[3:]
    q = code_string.split("[")
    if len(q) == 1:
        return code_string.strip(), None
    else:
        language = q[0].strip()
        filename = q[1].strip()[:-1]
    return language, filename


def test_docs(tmp_storage, tmp_path):
    wd = str(tmp_path / "snippets")
    os.makedirs(wd)

    # find all markdown files in docs
    # and extract code blocks
    for root, dirs, files in os.walk("docs"):
        for file in files:
            if not file.endswith(".md"):
                continue
            code_blocks = []
            doc = os.path.join(root, file)
            print(f"Parsing {doc}")
            with open(doc) as f:
                lines = f.readlines()
                codeblock = None
                in_code_block = False
                in_code = False
                is_test = False
                for i, line in enumerate(lines):
                    if line.startswith("::: code-group"):
                        codeblock = {
                            "fn": doc,
                            "start": i + 1,
                            "end": None,
                            "code": [],
                        }
                        in_code_block = True
                    elif line.startswith(":::") and in_code_block:
                        codeblock["end"] = i + 1
                        code_blocks.append(codeblock)
                        in_code_block = False
                    elif line.startswith("```") and in_code_block:
                        if in_code:
                            codeblock["code"][-1]["end"] = i + 1
                            in_code = False
                        else:
                            lang, fn = _parse_code_string(line)
                            if lang == "python":
                                codeblock["code"].append(
                                    {
                                        "start": i + 1,
                                        "end": None,
                                        "filename": fn,
                                        "content": "",
                                        "is_test": is_test,
                                    }
                                )
                                in_code = True
                    elif in_code:
                        codeblock["code"][-1]["content"] += line
                    elif in_code_block and not in_code:
                        if line.startswith("<!--") and "TEST" in line:
                            is_test = True
                        elif is_test and "-->" in line:
                            is_test = False
            for b, codeblock in enumerate(code_blocks):
                if not any([q["is_test"] for q in codeblock["code"]]):
                    continue
                os.makedirs(os.path.join(wd, str(b)))
                tests = []
                for c, code in enumerate(codeblock["code"]):
                    if code["filename"] and code["filename"].endswith(".py"):
                        code["module"] = os.path.splitext(code["filename"])[0]
                    else:
                        if not code["is_test"]:
                            raise RuntimeError(
                                "Non-test code block without filename"
                            )
                        code["filename"] = f"test_{c+1}.py"
                        code["module"] = f"test_{c+1}"
                    with open(
                        os.path.join(wd, str(b), code["filename"]), "w"
                    ) as f:
                        f.write(code["content"])
                    tests.append(code)

                with Project(os.path.join(wd, str(b))):
                    for test in tests:
                        # prettyprint test dict
                        print(f"Running {test['filename']}")
                        print(f"{test['start']}-{test['end']}")
                        import_from_directory(
                            test["module"],
                            os.path.join(wd, str(b)),
                            or_fail=True,
                        )
