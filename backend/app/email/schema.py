from datetime import datetime

from pydantic import BaseModel

from app.target.schema import TargetUrlResponse


class EmailAlertsResponse(BaseModel):
    created_at: datetime
    target: TargetUrlResponse

    class Config:
        from_attributes = True
