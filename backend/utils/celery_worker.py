import datetime

from celery import Celery
import requests
from sqlalchemy import func

from db import db_dependency, SessionLocal
from models import PingTarget, PingLogs
from utils.send_email import send_mail
import os
from dotenv import load_dotenv

load_dotenv()

BROKER_URL = os.getenv("BROKER_URL")
BACKEND_URL = os.getenv("BACKEND_URL")

app = Celery('celery_worker', broker=BROKER_URL, backend=BACKEND_URL)


@app.task
def monitor_endpoint():
    try:
        db = SessionLocal()
        print(f"db: {db}")
        print(f"Initializing endpoint monitoring at {datetime.datetime.utcnow()}")
        targets = db.query(PingTarget).filter(PingTarget.is_active == True).all()

        for target in targets:
            start_time = datetime.datetime.utcnow()
            response = requests.head(target.url)
            status_code = response.status_code
            end_time = datetime.datetime.utcnow()
            response_time = (end_time - start_time).total_seconds() * 1000  # Convert to milliseconds

            print(
                f"✅ Endpoint: {target.name}, URL: {target.url}, Status Code: {status_code}, Response Time: {response_time} ms")

            log_entry = PingLogs(
                target_id=target.id,
                status_code=status_code,
                response_time=int(response_time)
            )
            db.add(log_entry)

            if not (200 <= status_code < 300):
                target.is_down = True
                if target.send_email:
                    send_mail(user_id=target.user.id,
                              target_id=target.id,
                              email=target.user.email,
                              endpoint_name=target.name,
                              user_name=target.user.name,
                              endpoint_url=target.url,
                              timestamp=datetime.datetime.now(),
                              status_code=status_code,
                              db=db)
            else:
                target.is_down = False

        db.commit()

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
