from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.target.schema import TargetUrlResponse


class EmailAlertsResponse(BaseModel):
    created_at: datetime
    target: Optional[TargetUrlResponse] = None

    class Config:
        from_attributes = True
