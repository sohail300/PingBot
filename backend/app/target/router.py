from typing import Dict

from fastapi import APIRouter
from starlette import status

from app.target.schema import CreateTarget
from app.target.service import TargetService
from db import db_dependency
from middleware.auth import get_current_user_dependency

target_router = APIRouter(prefix='/api/target', tags=['target'])


@target_router.post("/create", response_model=Dict, status_code=status.HTTP_201_CREATED)
def create_target(details: CreateTarget, user: get_current_user_dependency, db: db_dependency):
    return TargetService.create_target(details, user, db)
