import datetime

from apscheduler.schedulers.background import BackgroundScheduler

from utils.celery_worker import monitor_endpoint

scheduler = BackgroundScheduler()


def run_process():
    try:
        print(f"Running process at {datetime.datetime.now()}")
        result = monitor_endpoint.delay()
        print(f"Task submitted: {result.id}")

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")


scheduler.add_job(run_process, 'cron', second='*/5')
