from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Boolean, func

from db import Base


class PingTarget(Base):
    __tablename__ = "ping_targets"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    url = Column(String(255), nullable=False)
    send_email = Column(Boolean, nullable=False)
    is_down = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, nullable=False, default=func.now())


class PingLogs(Base):
    __tablename__ = "ping_logs"

    id = Column(Integer, primary_key=True)
    target_id = Column(Integer, ForeignKey('ping_targets.id'), nullable=False)
    status_code = Column(Integer, nullable=False)
    response_time = Column(Integer, nullable=False)  # in milliseconds

    created_at = Column(DateTime, nullable=False, default=func.now())
