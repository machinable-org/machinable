from typing import TYPE_CHECKING

import os

from globus_sdk import (
    NativeAppAuthClient,
    RefreshTokenAuthorizer,
    TransferClient,
    TransferData,
)
from globus_sdk.scopes import TransferScopes
from globus_sdk.services.transfer.errors import TransferAPIError
from globus_sdk.tokenstorage import SimpleJSONFileAdapter
from machinable import Storage
from pydantic import BaseModel, Field

if TYPE_CHECKING:
    from machinable import Interface


class Globus(Storage):
    class Config(BaseModel):
        client_id: str = Field("???")
        remote_endpoint_id: str = Field("???")
        local_endpoint_id: str = Field("???")
        remote_endpoint_directory: str = Field("???")
        local_endpoint_directory: str = "~/"
        auth_filepath: str = "~/.globus-tokens.json"

    def __init__(self, version=None):
        super().__init__(version=version)
        self._auth_client = None
        self._auth_file = None
        self._authorizer = None
        self._transfer_client = None
        self.active_tasks = []

    @property
    def auth_client(self):
        if self._auth_client is None:
            self._auth_client = NativeAppAuthClient(self.config.client_id)
        return self._auth_client

    @property
    def auth_file(self):
        if self._auth_file is None:
            self._auth_file = SimpleJSONFileAdapter(
                os.path.expanduser(self.config.auth_filepath)
            )
        return self._auth_file

    @property
    def authorizer(self):
        if self._authorizer is None:
            if not self.auth_file.file_exists():
                # do a login flow, getting back initial tokens
                self.auth_client.oauth2_start_flow(
                    requested_scopes=f"{TransferScopes.all}[*https://auth.globus.org/scopes/{self.config.remote_endpoint_id}/data_access]",
                    refresh_tokens=True,
                )
                authorize_url = self.auth_client.oauth2_get_authorize_url()
                print(f"Please go to this URL and login:\n\n{authorize_url}\n")
                auth_code = input("Please enter the code here: ").strip()
                tokens = self.auth_client.oauth2_exchange_code_for_tokens(
                    auth_code
                )
                self.auth_file.store(tokens)
                tokens = tokens.by_resource_server["transfer.api.globus.org"]
            else:
                # otherwise, we already did login; load the tokens
                tokens = self.auth_file.get_token_data(
                    "transfer.api.globus.org"
                )

            self._authorizer = RefreshTokenAuthorizer(
                tokens["refresh_token"],
                self.auth_client,
                access_token=tokens["access_token"],
                expires_at=tokens["expires_at_seconds"],
                on_refresh=self.auth_file.on_refresh,
            )
        return self._authorizer

    @property
    def transfer_client(self):
        if self._transfer_client is None:
            self._transfer_client = TransferClient(authorizer=self.authorizer)
        return self._transfer_client

    def commit(self, interface: "Interface") -> str:
        try:
            src = os.path.abspath(interface.local_directory())
            if not os.path.exists(src):
                raise RuntimeError("Interface must be committed before storage")

            # This is not a strict requirement since client might allow access
            # if os.path.normpath(src) != os.path.normpath(self.local_path(interface.uuid)):
            #     raise RuntimeError("Interface directory must be in storage directory")

            task_data = TransferData(
                source_endpoint=self.config.local_endpoint_id,
                destination_endpoint=self.config.remote_endpoint_id,
                notify_on_succeeded=False,
                notify_on_failed=False,
            )

            task_data.add_item(
                src,
                self.remote_path(interface.uuid),
                recursive=True,
            )

            task_doc = self.transfer_client.submit_transfer(task_data)

            task_id = task_doc["task_id"]

            self.active_tasks.append(task_id)

            print(f"Submitted Globus commit, task_id={task_id}")

            # this operation is non-blocking by default

            return task_id
        except TransferAPIError as e:
            if e.code == "Conflict":
                return False
            elif e.code == "ConsentRequired":
                raise RuntimeError(
                    f"You do not have the right permissions. Try removing {self.config.auth_filepath} and authenticating again with the appropriate identity provider."
                ) from e
            raise e

    def update(self, interface: "Interface") -> None:
        return self.commit(interface)

    def contains(self, uuid: str) -> bool:
        # check if folder exists on globus storage
        try:
            response = self.transfer_client.operation_ls(
                self.config.remote_endpoint_id,
                path=self.remote_path(uuid),
                show_hidden=True,
            )
        except TransferAPIError as e:
            if e.code == "ClientError.NotFound":
                return False
            elif e.code == "ConsentRequired":
                raise RuntimeError(
                    f"You do not have the right permissions. Try removing {self.config.auth_filepath} and authenticating again with the appropriate identity provider."
                ) from e
            raise e

        for item in response:
            if item["name"] == ".machinable":
                return True

        return False

    def retrieve(
        self, uuid: str, local_directory: str, timeout: int = 5 * 60
    ) -> bool:
        if not self.contains(uuid):
            return False

        task_data = TransferData(
            source_endpoint=self.config.remote_endpoint_id,
            destination_endpoint=self.config.local_endpoint_id,
            notify_on_succeeded=False,
            notify_on_failed=False,
        )
        task_data.add_item(
            self.remote_path(uuid),
            local_directory,
        )
        task_doc = self.transfer_client.submit_transfer(task_data)
        task_id = task_doc["task_id"]
        self.active_tasks.append(task_id)

        print(f"[Storage] Submitted Globus retrieve, task_id={task_id}")

        self.tasks_wait(timeout=timeout)

        return True

    def tasks_wait(self, timeout: int = 5 * 60) -> None:
        for task_id in self.active_tasks:
            print(f"[Storage] Waiting for Globus task {task_id} to complete")
            self.transfer_client.task_wait(task_id, timeout=timeout)
            print(f"[Storage] task_id={task_id} transfer finished")
        self.active_tasks = []

    def local_path(self, *append):
        return os.path.join(self.config.local_endpoint_directory, *append)

    def remote_path(self, *append):
        return os.path.join(self.config.remote_endpoint_directory, *append)
