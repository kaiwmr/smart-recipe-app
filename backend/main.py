from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from routers import recipes, users, auth
from config import settings
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from limiter import limiter

origins = [ settings.FRONTEND_URL]


# Datenbank-Tabellen erstellen
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(CORSMiddleware, allow_origins= origins, allow_credentials= True, allow_methods=["*"], allow_headers= ["*"])
app.include_router(recipes.recipe_router, prefix="/recipes")
app.include_router(users.users_router, prefix="/users")
app.include_router(auth.auth_router)

@app.get("/")
def read_root():
    return {"message": "Willkommen bei SmartRecipe!"}

