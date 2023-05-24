import os
from dataclasses import dataclass

from globus_sdk import (
    NativeAppAuthClient,
    RefreshTokenAuthorizer,
    TransferClient,
)
from globus_sdk.scopes import TransferScopes
from globus_sdk.services.transfer.errors import TransferAPIError
from globus_sdk.tokenstorage import SimpleJSONFileAdapter
from machinable import Storage
from machinable.config import RequiredField


class Globus(Storage):
    @dataclass
    class Config(Storage.Config):
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
                    requested_scopes=TransferScopes.all,
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

    def contains(self) -> bool:
        # check if folder exists on globus storage
        try:
            response = self.transfer_client.operation_ls(
                self.config.remote_endpoint_id,
                path=self.config.remote_endpoint_directory,
            )
        except TransferAPIError as e:
            if e.code == "ClientError.NotFound":
                return False
            elif e.code == "ConsentRequired":
                raise ValueError(
                    "Please give consent to the Globus app to access your storage."
                ) from e
            raise e

        for item in response:
            if item["name"] == ".machinable":
                return True

        return False

    def on_commit(self) -> None:
        pass

    def on_retrieve(self, uuid: str, target_directory: str) -> None:
        pass
