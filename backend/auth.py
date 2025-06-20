import os
from typing import Annotated, Optional
from logger import logger
from dotenv import load_dotenv
from db import db_dependency
from fastapi import Request, Depends
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import AuthenticateRequestOptions

from models import User

load_dotenv()

sdk = Clerk(bearer_auth=os.getenv('CLERK_SECRET_KEY'))

AUTHORIZED_PARTIES = os.getenv("AUTHORIZED_PARTIES")


def get_current_user(request: Request, db: db_dependency):
    try:
        request_state = sdk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=[AUTHORIZED_PARTIES]
            )
        )
        print(f"Request State: {request_state}")

        if not request_state.is_signed_in:
            return None

        user_id = request_state.payload['sub']

        if not user_id:
            return None

        db_user = db.query(User).filter(User.id == user_id).first()

        if not db_user:
            return None

        return db_user

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        logger.error(f"Error in get_current_user: {str(e)}")


get_current_user_dependency = Annotated[Optional[User], Depends(get_current_user)]
