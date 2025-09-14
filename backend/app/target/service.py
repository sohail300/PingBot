from datetime import datetime, timedelta
from typing import List
from urllib.parse import urlparse

from sqlalchemy import and_

from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm import Session
from starlette import status

from app.target.schema import CreateTarget, TargetListResponse, TargetLogsResponse
from logger import logger
from models import User, PingTarget, PingLogs


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

            parsed = urlparse(details.url)
            if parsed.scheme in ["http", "https"] and not parsed.hostname.startswith(("127.", "localhost")):

                target = PingTarget(
                    user_id=user.id,
                    **details.model_dump(),
                )

                db.add(target)
                db.commit()
                db.refresh(target)

                return {
                    "message": f"Target created successfully: {target.id}"
                }

            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid URL format. Must start with http:// or https:// and must not be localhost url"
                )

        except IntegrityError as e:
            db.rollback()
            error_str = str(e.orig).lower()
            if 'uq_user_url' in error_str or 'unique constraint' in error_str:
                logger.error(f"Duplicate URL error for user {user.id}: {details.url}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This Endpoint URL already exists for your account"
                )
            else:
                logger.error(f"Database integrity error: {str(e)}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Data integrity error occurred"
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

    @staticmethod
    def uptime_calculator(target: PingTarget, hours: int = 24, db: Session = None) -> dict:
        """
        Calculate uptime percentage for a target over specified days

        Args:
            target: PingTarget instance
            days: Number of days to calculate uptime for (default: 30)
            db: Database session

        Returns:
            dict: Contains uptime_percentage, total_checks, successful_checks, downtime_minutes
        """
        if not db:
            raise ValueError("Database session is required")

        # Calculate the time window
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(hours=hours)

        # Get all ping logs for the target within the time window
        ping_logs = db.query(PingLogs).filter(
            and_(
                PingLogs.target_id == target.id,
                PingLogs.created_at >= start_time,
                PingLogs.created_at <= end_time
            )
        ).order_by(PingLogs.created_at).all()

        if not ping_logs:
            return {
                "uptime_percentage": 0.0,
                "total_checks": 0,
                "successful_checks": 0,
                "period_hours": hours
            }

        total_checks = len(ping_logs)
        successful_checks = 0
        downtime_minutes = 0

        # Count successful pings and calculate downtime
        for i, log in enumerate(ping_logs):
            # Consider successful if status code is 2xx or 3xx and response time is reasonable
            is_successful = (
                    200 <= log.status_code < 400 and
                    log.response_time < 30000  # 30 seconds timeout
            )

            if is_successful:
                successful_checks += 1
            else:
                # Add 30 minutes of downtime for each failed ping
                downtime_minutes += 30

        uptime_percentage = (successful_checks / total_checks) * 100 if total_checks > 0 else 0

        return {
            "uptime_percentage": round(uptime_percentage, 2),
            "total_checks": total_checks,
            "successful_checks": successful_checks,
            "period_hours": hours
        }

    @staticmethod
    def list_targets(user: User, db: Session):
        try:
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not authenticated"
                )

            if not user.targets:
                return []

            targets_with_uptime = []

            for target in user.targets:
                # Calculate uptime for each target
                uptime_info = TargetService.uptime_calculator(target=target, hours=24, db=db)

                # Create target response with uptime info
                target_data = target.__dict__.copy()  # Get target attributes
                target_data['uptime_info'] = uptime_info

                target_response = TargetListResponse.model_validate(target_data)
                targets_with_uptime.append(target_response)

            return [TargetListResponse.model_validate(target) for target in targets_with_uptime]

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

    @staticmethod
    def dashboard_stats(user: User, db: Session):
        try:

            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not authenticated"
                )

            up_count = 0
            total_uptime = 0.0
            counted_targets = 0

            for target in user.targets:
                if target.is_down is False:
                    up_count = up_count + 1

                uptime_info = TargetService.uptime_calculator(target=target, hours=24, db=db)

                if uptime_info["total_checks"] > 0:
                    total_uptime += uptime_info["uptime_percentage"]
                    counted_targets += 1

            average_uptime = (total_uptime / counted_targets) if counted_targets > 0 else 0.0

            return {
                "total_endpoints": len(user.targets),
                "up_count": up_count,
                "average_uptime_percentage": round(average_uptime, 2)
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

    @staticmethod
    def toggle_target_activity(target_id: int, user: User, db: Session):
        try:
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not authenticated"
                )

            target = db.query(PingTarget).filter(
                PingTarget.id == target_id,
                PingTarget.user_id == user.id
            ).first()

            if not target:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Target not found"
                )

            # Toggle the is_active state
            target.is_active = not target.is_active

            db.commit()
            db.refresh(target)

            return {
                "message": f"Target {target_id} {'activated' if target.is_active else 'deactivated'} successfully"
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

    @staticmethod
    def delete_target(target_id: int, user: User, db: Session):
        try:
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not authenticated"
                )

            target = db.query(PingTarget).filter(
                PingTarget.id == target_id,
                PingTarget.user_id == user.id
            ).first()

            if not target:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Target not found"
                )

            db.delete(target)
            db.commit()

            return {
                "message": f"Target {target_id} deleted successfully"
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

    @staticmethod
    def get_target_logs(target_ids: List[int], user: User, db: Session):
        try:
            if user is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not authenticated"
                )

            targets = db.query(PingTarget).filter(
                PingTarget.id.in_(target_ids),
                PingTarget.user_id == user.id
            ).all()

            if not targets:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="No targets found"
                )

            logs = []
            for target in targets:
                logs.extend(target.logs)

            return [TargetLogsResponse.model_validate(log) for log in logs]

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
