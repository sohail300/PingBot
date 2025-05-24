import os
from datetime import datetime
from typing import Dict

from fastapi import HTTPException, Request
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from starlette import status
from dotenv import load_dotenv

from app.webhook.model import User
from svix.webhooks import Webhook, WebhookVerificationError

from logger import logger

load_dotenv()

WEBHOOK_SECRET_KEY = os.getenv("WEBHOOK_SECRET_KEY")


class WebhookService:
    def __init__(self):
        pass

    @staticmethod
    async def create_user(request: Request, payload: Dict, db: Session):
        try:
            headers = request.headers
            payload_bytes = await request.body()

            wh = Webhook(WEBHOOK_SECRET_KEY)
            msg = wh.verify(payload_bytes, headers)

            db_user = db.query(User).filter(User.id == msg['data']['id']).first()
            if db_user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User already exists"
                )

            new_user = User(
                id=msg['data']['id'],
                name=f"{msg['data']['first_name']} {msg['data']['last_name']}",
                email=msg['data']['email_addresses'][0]['email_address'],
                image=msg['data']['profile_image_url'],
                role="User",
                created_at=datetime.fromtimestamp(msg['data']['created_at'] / 1000)
            )

            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            return {
                "status": "success",
                "message": "User created successfully",
            }

        except WebhookVerificationError as e:
            print(f"Webhook verification error: {e}")
            logger.error(f"Webhook verification failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Webhook verification failed: {str(e)}"
            )

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
