import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.email.router import email_router
from app.target.router import target_router
from app.webhook.router import webhook_router
from db import engine, Base
from auth import get_current_user_dependency
from utils.scheduler import scheduler

load_dotenv()

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.start()
    yield


app = FastAPI(
    lifespan=lifespan,
    title='Pingbot',
    description='Prevent cold starts, monitor uptime, and get instant notifications when your services go down.',
    version='0.1.0',
)

app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"], )


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="FastAPI application",
        version="1.0.0",
        description="JWT Authentication and Authorization",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.get('/')
async def root():
    return {'message': 'Healthy Server!'}


@app.get('/test')
async def test_route(user: get_current_user_dependency):
    if user:
        print(user)
        return {'user': user}

    else:
        print("No authenticated user")
        return {'user_id': None}


app.include_router(webhook_router)
app.include_router(target_router)
app.include_router(email_router)

PORT = os.getenv("PORT", 8000)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host='0.0.0.0', port=PORT, reload=True, workers=1)
