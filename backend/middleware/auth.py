import os
from typing import Annotated, Optional
from jose import jwt
from starlette.middleware.base import BaseHTTPMiddleware
from logger import logger
from dotenv import load_dotenv
from db import db_dependency
from app.webhook.model import User
from fastapi import Request, Depends

load_dotenv()

CLERK_PEM_PUBLIC_KEY = os.getenv("CLERK_PEM_PUBLIC_KEY")


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            auth_header = request.headers.get("Authorization")

            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]
                request.state.token = token
            else:
                request.state.token = None

            response = await call_next(request)
            return response

        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            logger.error(f"Error in AuthMiddleware: {str(e)}")


def get_current_user(request: Request, db: db_dependency):
    try:
        token = getattr(request.state, "token", None)

        if token:
            decoded = jwt.decode(token, CLERK_PEM_PUBLIC_KEY, algorithms=["RS256"], options={"verify_aud": False})

            user_id = decoded.get("sub")

            if user_id:
                db_user = db.query(User).filter(User.id == user_id).first()

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
        print(f"Unexpected error2: str{e}")
        logger.error(f"Error in get_current_user: {str(e)}")


get_current_user_dependency = Annotated[Optional[User], Depends(get_current_user)]
