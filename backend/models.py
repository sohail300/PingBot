from sqlalchemy import Integer, ForeignKey, Boolean, func, UniqueConstraint
from sqlalchemy import Column, String, Enum, DateTime
from sqlalchemy.orm import relationship

from db import Base

user_role_enum = Enum(
    "User",
    "Admin",
    name="user_role_enum",
    create_type=True
)


class UserRoleEnum(str, Enum):
    User = "User"
    Admin = "Admin"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    image = Column(String(255), nullable=True)
    role = Column(user_role_enum, default=UserRoleEnum.User, nullable=False)

    created_at = Column(DateTime, nullable=False)

    emails = relationship("EmailsSent", back_populates="user")
    targets = relationship("PingTarget", back_populates="user")


class EmailsSent(Base):
    __tablename__ = "emails_sent"

    id = Column(Integer, primary_key=True)
    target_id = Column(
        Integer,
        ForeignKey('ping_targets.id', ondelete="SET NULL"),
        nullable=True  # Make this nullable to allow SET NULL
    )
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    subject = Column(String(255), nullable=False)
    body = Column(String, nullable=False)

    created_at = Column(DateTime, nullable=False, default=func.now())

    user = relationship("User", back_populates="emails")
    target = relationship("PingTarget", back_populates="emails")


class PingTarget(Base):
    __tablename__ = "ping_targets"

    id = Column(Integer, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'), nullable=False)
    name = Column(String, nullable=False)
    url = Column(String(255), nullable=False)
    send_email = Column(Boolean, nullable=False)
    is_down = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, nullable=False, default=func.now())

    __table_args__ = (
        UniqueConstraint('user_id', 'url', name='uq_user_url'),
    )

    emails = relationship("EmailsSent", back_populates="target", passive_deletes=True)
    logs = relationship("PingLogs", back_populates="target", cascade="all, delete-orphan")
    user = relationship("User", back_populates="targets")


class PingLogs(Base):
    __tablename__ = "ping_logs"

    id = Column(Integer, primary_key=True)
    target_id = Column(Integer, ForeignKey('ping_targets.id'), nullable=False)
    status_code = Column(Integer, nullable=False)
    response_time = Column(Integer, nullable=False)  # in milliseconds

    created_at = Column(DateTime, nullable=False, default=func.now())

    target = relationship("PingTarget", back_populates="logs")
