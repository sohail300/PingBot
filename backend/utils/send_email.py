import os
from datetime import datetime

import resend
from dotenv import load_dotenv

from db import db_dependency
from models import EmailsSent
from utils.email_format import subject, html

from utils.dynamic_content import dynamic_content

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")


def send_mail(user_id: str, target_id: int, email: str, endpoint_name, user_name: str, endpoint_url: str,
              timestamp: datetime, status_code: int, db: db_dependency):
    subject_values = {
        "endpoint_name": endpoint_name
    }
    email_subject = dynamic_content(content=subject, values=subject_values)
    print(f"Timestamp: {timestamp}")

    html_values = {
        "user_name": user_name,
        "endpoint_url": endpoint_url,
        "timestamp": timestamp,
        "status_code": status_code
    }
    email_html = dynamic_content(content=html, values=html_values)

    params: resend.Emails.SendParams = {
        "from": "Md Sohail Ansari <contact@heysohail.me>",
        "to": [email],
        "subject": email_subject,
        "html": email_html
    }

    email = resend.Emails.send(params)

    db_email = EmailsSent(
        user_id=user_id,
        target_id=target_id,
        subject=email_subject,
        body=email_html
    )
    db.add(db_email)

# send_mail(
#     email="sohailatwork10@gmail.com",
#     endpoint_name="User Login API",
#     user_name="Sohail",
#     endpoint_url="https://api.zapmail.in/v1/auth/login",
#     timestamp="2025-06-01 10:45:23",
#     status_code="200 OK"
# )
