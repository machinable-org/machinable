class Config:
    """Project configuration interface"""

    def __init__(self, project_directory: str) -> None:
        self._project_directory = project_directory
