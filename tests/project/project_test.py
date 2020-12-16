import os
import shutil
from zipfile import ZipFile

from machinable import execute
from machinable.project import Project


def test_project_config():
    test_project = Project("./test_project")

    assert test_project.config_filepath == "./test_project/machinable.yaml"

    config = test_project.get_config()

    # default values
    assert "+" in config
    assert "_evaluate" in config

    # import prefix
    import_project = Project("test_project/vendor/fooba")
    assert import_project.import_prefix == "test_project.vendor.fooba"
    import_project = Project("test_project/vendor/fooba/vendor/bedrock")
    assert import_project.import_prefix == "test_project.vendor.fooba.vendor.bedrock"


def test_project_name():
    test_project = Project("./test_project")
    assert test_project.name == "test_project"
    assert Project({"name": "invalid$"}).name is None


def test_project_parse_imports():
    test_project = Project("./test_project")

    # remove cache
    cache_path = os.path.join(test_project.directory_path, "vendor", ".cache")
    if os.path.exists(cache_path) and os.path.isdir(cache_path):
        shutil.rmtree(cache_path)

    imports = test_project.parse_imports()

    # import with prefix
    assert "fooba.models.baseline" in imports["components"]
    assert "fooba.experiments.start" in imports["components"]

    # args loaded?
    assert (
        imports["components"]["fooba.models.baseline"]["args"]["overwrite"] == "orginal"
    )
    assert imports["components"]["fooba.experiments.start"]["args"]["test"] == 123

    # args loaded with config inheritance?
    t = imports["components"]["fooba.models.config_inheritance"]["args"]
    assert t["hello"] == "inheritance"
    assert t["overwrite"] == "extended"
    assert t["referenced"] == "extended"

    # args loaded with config dependency inheritance?
    t = imports["components"]["fooba.models.config_dependency_inheritance"]["args"]
    assert t["here"] == "we_go"
    assert t["from_deep_down"] == "huzzah"
    assert t["deep_overwrite"] == "successful"

    # args loaded with chained dependency inheritance?
    t = imports["components"]["fooba.models.chained_inheritance"]["args"]
    assert t["here"] == "we_go"
    assert t["from_deep_down"] == "huzzah"
    assert t["deep_overwrite"] == "early"

    # for experiments:
    t = imports["components"]["fooba.experiments.dependent"]["args"]
    assert t["elephant"] == "at_home"
    assert t["nested"]["elephants"] == "outside"
    assert t["overwrite_me"]["keep"] == "me"
    assert t["overwrite_me"]["nested"] == "level"

    # for mixins
    t = imports["mixins"]["fooba.test"]["args"]
    assert t["imported"] == "hello"
    t = imports["mixins"]["fooba.mixins.nested"]["args"]
    assert t["level"] == -1

    # is importable?
    for k, v in imports["components"].items():
        if k.find("@") != -1:
            continue
        v["class"].load(instantiate=False)


def test_parse_config():
    test_project = Project("./test_project")

    config = test_project.parse_config()

    # args loaded?
    assert config["components"]["childexp"]["args"]["a"] == 2
    assert config["components"]["inherit"]["args"]["blub"] == "bla"
    assert (
        config["components"]["test_dependent"]["args"]["overwrite_me"]["nested"]
        == "here"
    )
    assert config["components"]["cool"]["args"]["bla"] == "blub"

    # args from imports correct?
    assert config["components"]["+.fooba.models.baseline"]["args"]["overwrite"]

    # check scoped inheritance
    assert config["components"]["inheritance_from_other_section"]["args"]["alpha"] == 0
    assert config["components"]["inheritance_from_outer_section"]["args"]["id"] == -1

    # is importable?
    for k, v in config["components"].items():
        if k.find("@") != -1:
            continue
        if v["module"] in [
            "test_project.component",
            "test_project.scope.section",
            "test_project.uses_default_module",
        ]:
            continue
        v["class"].load(instantiate=False)


def test_lineage_recording():
    test_project = Project("./test_project")
    config = test_project.parse_config()

    def _linage(component):
        return config["components"][component]["flags"]["LINEAGE"]

    assert _linage("childexp") == ["thenode"]
    assert _linage("inherit") == ["+.fooba.experiments.start", "start_parent"]
    assert _linage("test_dependent") == ["base", "grandfurther"]


def test_project_code_backup(helpers):
    # create symlinks
    p = "./test_project/code_backup"
    os.makedirs(p + "/project/catch_me", exist_ok=True)
    with open(p + "/project/catch_me/if-you-can.txt", "w") as f:
        f.write("test")
    with open(p + "/extern/ignore_me.txt", "w") as f:
        f.write("please")
    try:
        os.symlink(
            os.path.abspath(p + "/project/catch_me"),
            p + "/project/link",
            target_is_directory=True,
        )
    except FileExistsError:
        pass
    try:
        os.symlink(
            os.path.abspath(p + "/extern"),
            p + "/project/external_link",
            target_is_directory=True,
        )
    except FileExistsError:
        pass

    # test backup
    helpers.tmp_directory("code_backup")
    target_file = "./_test_data/code_backup/code.zip"
    if os.path.isfile(target_file):
        os.remove(target_file)
    project = Project(p + "/project")
    # manual
    assert project.backup_source_code(target_file) is True
    archive = ZipFile(target_file)
    assert set(map(lambda f: f.filename, archive.filelist)) == {
        "machinable.yaml",
        "main.py",
        "dummy.py",
        "link/",
        "link/if-you-can.txt",
        "external_link/",
        "external_link/ignore_me.txt",
        "external_link/come-find-me.txt",
    }
    # during execution
    e = execute("dummy", storage="./_test_data/code_backup/symlinks", project=project)
    assert os.path.isfile(e.storage.get_local_directory("code.zip"))


def test_project_get_code_version():
    project = Project("./test_project")
    assert isinstance(project.get_code_version(), dict)
