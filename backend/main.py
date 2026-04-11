from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import models
from database import engine
from routers import recipes, users, auth
from config import settings
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from limiter import limiter
from pathlib import Path

origins = settings.FRONTEND_URLS


models.Base.metadata.create_all(bind=engine)

# Sicherstellen, dass das Upload-Verzeichnis existiert, bevor StaticFiles initialisiert wird
Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

app = FastAPI()

app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(CORSMiddleware, allow_origins= origins, allow_credentials= True, allow_methods=["*"], allow_headers= ["*"])
app.include_router(recipes.recipe_router, prefix="/recipes")
app.include_router(users.users_router, prefix="/users")
app.include_router(auth.auth_router)

@app.get("/")
def read_root():
    return {"message": "Willkommen bei BiteWise!"}
