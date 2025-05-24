from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette import status

from app.target.model import PingTarget
from app.target.schema import CreateTarget
from app.webhook.model import User
from logger import logger


class TargetService:
    def __init__(self):
        pass

    @staticmethod
    def create_target(details: CreateTarget, user: User, db: Session):
        try:
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not authenticated"
                )

            target = PingTarget(
                user_id=user.id,
                **details.model_dump(),
            )

            db.add(target)
            db.commit()
            db.refresh(target)

            print(f"Target created successfully: {target.id}")
            return {
                "message": f"Target created successfully: {target.id}"
            }

        except SQLAlchemyError as e:
            print(f"Database error: {e}")
            logger.error(f"Database error: {str(e)}")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error occurred: {str(e)}"
            )

        except Exception as e:
            print(f"Unexpected error: {e}")
            print(f"Error type: {type(e)}")
            logger.error(f"Unexpected error: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error: {str(e)}"
            )
