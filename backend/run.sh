#!/bin/bash
uvicorn main:app --host 0.0.0.0 --port 8000 &
celery -A utils.celery_worker worker --loglevel=info -P solo
