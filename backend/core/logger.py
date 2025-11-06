import logging

logging.basicConfig(
    filename='logs/info.log',
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger("app_logger")
