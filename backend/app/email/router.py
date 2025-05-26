from typing import List, Dict

from fastapi import APIRouter
from sqlalchemy.orm import Session
from starlette import status

from app.email.schema import EmailAlertsResponse
from app.email.service import EmailService
from db import db_dependency
from middleware.auth import get_current_user_dependency

email_router = APIRouter(prefix='/api/email', tags=['email'])


@email_router.get('/list', response_model=List[EmailAlertsResponse], status_code=status.HTTP_200_OK)
def get_email_alerts(user: get_current_user_dependency, db: db_dependency):
    """
    Retrieve email settings for the authenticated user.
    """
    return EmailService.get_email_alerts(user, db)


@email_router.get('/toggle', response_model=Dict, status_code=status.HTTP_201_CREATED)
def toggle_email_alert(target_id: int, user: get_current_user_dependency, db: db_dependency):
    """
    Retrieve email settings for the authenticated user.
    """
    return EmailService.toggle_email_alert(target_id, user, db)
