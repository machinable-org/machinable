import os
from dataclasses import dataclass

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
from machinable.config import RequiredField


class Globus(Storage):
    @dataclass
    class Config:
        client_id: str = RequiredField
        local_endpoint_id: str = RequiredField
        local_endpoint_directory: str = RequiredField
        remote_endpoint_id: str = RequiredField
        remote_endpoint_directory: str = RequiredField
        auth_filepath: str = "~/.globus-tokens.json"

    def __init__(self, version=None):
        super().__init__(version=version)
        self._auth_client = None
        self._auth_file = None
        self._authorizer = None
        self._transfer_client = None

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

    def commit(self, interface: "Interface") -> None:
        ...

    def update(self, interface: "Interface") -> None:
        ...

    def contains(self, uuid: str) -> bool:
        # check if folder exists on globus storage
        try:
            response = self.transfer_client.operation_ls(
                self.config.remote_endpoint_id,
                path=os.path.join(self.config.remote_endpoint_directory, uuid),
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

    def retrieve(self, uuid: str, local_directory: str) -> bool:
        # task_data = TransferData(
        #     source_endpoint=self.config.remote_endpoint_id,
        #     destination_endpoint=self.config.local_endpoint_id,
        # )
        # task_data.add_item(
        #     os.path.join(self.config.remote_endpoint_directory, uuid),
        #     target_directory,
        # )

        # task_doc = self.transfer_client.submit_transfer(task_data)
        # task_id = task_doc["task_id"]
        # print(f"submitted transfer, task_id={task_id}")
        return False
