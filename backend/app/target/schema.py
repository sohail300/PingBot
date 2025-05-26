from typing import Dict

from pydantic import BaseModel


class CreateTarget(BaseModel):
    url: str
    send_email: bool


class TargetUrlResponse(BaseModel):
    id: int
    url: str

    class Config:
        from_attributes = True


class TargetListResponse(BaseModel):
    id: int
    url: str
    send_email: bool
    is_down: bool
    is_active: bool
    uptime_info: Dict

    class Config:
        from_attributes = True


class TargetLogsResponse(BaseModel):
    id: int
    target: TargetUrlResponse
    status_code: int
    response_time: int
    created_at: str

    class Config:
        from_attributes = True
