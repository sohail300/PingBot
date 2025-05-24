import os
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.email.router import email_router
from app.target.router import target_router
from app.webhook.router import webhook_router
from db import engine, Base
from middleware.auth import AuthMiddleware, get_user_dependency

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title='Pingbot',
    description='Prevent cold starts, monitor uptime, and get instant notifications when your services go down.',
    version='0.1.0',
)

app.middleware(CORSMiddleware)

app.middleware(AuthMiddleware)


@app.get('/')
async def root():
    return {'message': 'Healthy Server!'}

# @app.get('/test')
# async def test_route(user: get_user_dependency):
#     print(user)
#     print(user.id)
#
#     return {'message': 'Healthy Server!'}


app.include_router(email_router)
app.include_router(webhook_router)
app.include_router(target_router)

PORT = os.getenv("PORT", 8000)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host='0.0.0.0', port=PORT, reload=True, workers=1)
