from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from starlette import status

from app.email.schema import EmailAlertsResponse
from logger import logger
from models import PingTarget


class EmailService:
    def __init__(self):
        pass

    @staticmethod
    def get_email_alerts(user, db):
        """
        Retrieve email settings for the authenticated user.
        """
        try:
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not authenticated"
                )

            return [EmailAlertsResponse.model_validate(email) for email in user.emails]

        except SQLAlchemyError as e:
            print(f"Database error: {str(e)}")
            logger.error(f"Database error: {str(e)}")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error occurred: {str(e)}"
            )

        except Exception as e:
            print(f"Database error: {str(e)}")
            logger.error(f"Unexpected error: {str(e)}")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error: {str(e)}"
            )

    @staticmethod
    def toggle_email_alert(target_id: int, user, db):
        try:
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not authenticated"
                )

            target = db.query(PingTarget).filter_by(id=target_id, user_id=user.id).first()

            if not target:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Target not found"
                )

            # Toggle the email alert setting
            target.send_email = not target.send_email

            db.commit()

            return {
                "message": f"Email alert for target {target_id} {'enabled' if target.send_email else 'disabled'} successfully."
            }

        except SQLAlchemyError as e:
            print(f"Database error: {str(e)}")
            logger.error(f"Database error: {str(e)}")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error occurred: {str(e)}"
            )

        except Exception as e:
            print(f"Database error: {str(e)}")
            logger.error(f"Unexpected error: {str(e)}")
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error: {str(e)}"
            )
