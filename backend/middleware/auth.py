import os

import jwt
from fastapi import Depends
from requests import Request
from starlette.middleware.base import BaseHTTPMiddleware
from logger import logger
from dotenv import load_dotenv
from db import db_dependency
from app.webhook.model import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            auth_header = request.headers.get("Authorization")

            if auth_header and auth_header.startsWith("Bearer "):
                token = auth_header.split(" ")[1]
                request.state.token = token
            else:
                request.state.token = None

            response = await call_next(request)
            return response

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")


def get_current_user(request: Request, db: db_dependency):
    try:
        token = request.state.token

        if token:

            # get the user
            decoded = jwt.decode(token, SECRET_KEY, algorithms=["RS256"], options={"verify_aud": False})
            logger.info(f"Decoded: {decoded}")

            user_id = decoded.get("sub")
            logger.info(f"user_id: {user_id}")

            if user_id:
                db_user = db.query(User).filter(User.id == user_id).first()

                logger.info(f"db_user_id: {db_user.id}")

                if db_user:
                    user = db_user
                else:
                    user = None

            else:
                user = None

        else:
            user = None

        return user

    except Exception as e:
        logger.error(f"Unexpected error: str{e}")


get_user_dependency = Depends(get_current_user)
