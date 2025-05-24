from sqlalchemy import Column, String, DateTime, Integer, ForeignKey, Boolean, func

from db import Base


class EmailsSent(Base):
    __tablename__ = "emails_sent"

    id = Column(Integer, primary_key=True)
    target_id = Column(Integer, ForeignKey('ping_targets.id'), nullable=False)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    subject = Column(String(255), nullable=False)
    body = Column(String, nullable=False)

    created_at = Column(DateTime, nullable=False, default=func.now())
