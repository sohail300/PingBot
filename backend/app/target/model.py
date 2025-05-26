from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Boolean, func, UniqueConstraint
from sqlalchemy.orm import relationship

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

    __table_args__ = (
        UniqueConstraint('user_id', 'url', name='uq_user_url'),
    )

    emails = relationship("EmailsSent", back_populates="target")
    logs = relationship("PingLogs", back_populates="target")
    user = relationship("User", back_populates="targets")


class PingLogs(Base):
    __tablename__ = "ping_logs"

    id = Column(Integer, primary_key=True)
    target_id = Column(Integer, ForeignKey('ping_targets.id'), nullable=False)
    status_code = Column(Integer, nullable=False)
    response_time = Column(Integer, nullable=False)  # in milliseconds

    created_at = Column(DateTime, nullable=False, default=func.now())

    target = relationship("PingTarget", back_populates="logs")
