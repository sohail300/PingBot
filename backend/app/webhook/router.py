from typing import Dict

from fastapi import APIRouter, Request

from app.webhook.service import WebhookService
from db import db_dependency

webhook_router = APIRouter(prefix='/api/webhook', tags=['webhook'])


@webhook_router.post('/user', response_model=Dict)
async def create_user(request: Request, payload: Dict, db: db_dependency):
    """
    Create a new user via webhook.
    """
    return await WebhookService.create_user(request, payload, db)
