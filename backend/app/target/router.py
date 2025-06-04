from typing import Dict, List

from fastapi import APIRouter
from starlette import status

from app.target.schema import CreateTarget, TargetListResponse, TargetLogsResponse
from app.target.service import TargetService
from db import db_dependency
from auth import get_current_user_dependency

target_router = APIRouter(prefix='/api/target', tags=['target'])


@target_router.post("/create", response_model=Dict, status_code=status.HTTP_201_CREATED)
def create_target(details: CreateTarget, user: get_current_user_dependency, db: db_dependency):
    return TargetService.create_target(details, user, db)


@target_router.get("/list", response_model=List[TargetListResponse], status_code=status.HTTP_200_OK)
def list_targets(user: get_current_user_dependency, db: db_dependency):
    return TargetService.list_targets(user, db)


@target_router.get("/dashboard-stats", response_model=Dict, status_code=status.HTTP_200_OK)
def dashboard_stats(user: get_current_user_dependency, db: db_dependency):
    return TargetService.dashboard_stats(user, db)


@target_router.put("/toggle", response_model=Dict, status_code=status.HTTP_201_CREATED)
def toggle_target_activity(target_id: int, user: get_current_user_dependency, db: db_dependency):
    return TargetService.toggle_target_activity(target_id, user, db)


@target_router.delete("/delete", response_model=Dict, status_code=status.HTTP_201_CREATED)
def delete_target(target_id: int, user: get_current_user_dependency, db: db_dependency):
    return TargetService.delete_target(target_id, user, db)


@target_router.get("/logs", response_model=List[TargetLogsResponse], status_code=status.HTTP_200_OK)
def get_target_logs(target_id: int, user: get_current_user_dependency, db: db_dependency):
    return TargetService.get_target_logs(target_id, user, db)
