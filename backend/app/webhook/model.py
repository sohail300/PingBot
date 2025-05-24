from sqlalchemy import Column, String, Enum, DateTime

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
