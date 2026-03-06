from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine
from dotenv import load_dotenv
from routers import recipes, users, auth
from config import settings

load_dotenv()

origins = [ settings.FRONTEND_URL]


# Datenbank-Tabellen erstellen
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins= origins, allow_credentials= True, allow_methods=["*"], allow_headers= ["*"])
app.include_router(recipes.recipe_router, prefix="/recipes")
app.include_router(users.users_router, prefix="/users")
app.include_router(auth.auth_router)

@app.get("/")
def read_root():
    return {"message": "Willkommen bei SmartRecipe!"}

