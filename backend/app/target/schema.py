from datetime import datetime
from typing import Dict

from pydantic import BaseModel


class CreateTarget(BaseModel):
    name: str
    url: str
    send_email: bool


class TargetUrlResponse(BaseModel):
    id: int
    name: str
    url: str

    class Config:
        from_attributes = True


class TargetListResponse(BaseModel):
    id: int
    name: str
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
    created_at: datetime

    class Config:
        from_attributes = True
