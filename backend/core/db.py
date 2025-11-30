from typing import Annotated

from dotenv import load_dotenv
import os

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

load_dotenv()

DB_URL = os.getenv("DB_URL")

if not DB_URL:
    raise ValueError(
        "DB_URL environment variable is not set. "
        "Please set it in your .env file or pass it as an environment variable. "
        "Example: DB_URL=postgresql://user:password@host:port/database"
    )

# SQLAlchemy 2.0 requires postgresql:// instead of postgres://
if DB_URL.startswith("postgres://"):
    DB_URL = DB_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DB_URL)

Base = declarative_base()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
