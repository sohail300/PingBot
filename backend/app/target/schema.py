from pydantic import BaseModel


class CreateTarget(BaseModel):
    url: str
    send_email: bool
