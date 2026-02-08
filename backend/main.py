from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
import crud
import services.website_content_generator as website_content_generator
import services.tiktok_content_generator as tiktok_content_generator
from database import engine, SessionLocal
from jose import jwt
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from typing import List
import os
from dotenv import load_dotenv


load_dotenv()

origins = [
    "http://localhost:3000", # React Standard
    "http://localhost:5173", # Vite Standard (modernes React)
    "https://smart-recipe-frontend-hwxe.onrender.com"
]


# Datenbank-Tabellen erstellen
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins= origins, allow_credentials= True, allow_methods=["*"], allow_headers= ["*"])


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 300

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def create_access_token(data:dict) -> str:
    data_copy = data.copy()
    expire_time = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data_copy["exp"] = expire_time
    token = jwt.encode(data_copy, key= SECRET_KEY, algorithm=ALGORITHM)

    return token



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> models.User:

    credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials", headers={"WWW-Authenticate": "Bearer"})

    try:
        token_data = jwt.decode(token, key= SECRET_KEY, algorithms=[ALGORITHM])
        user_email = token_data.get("sub")

        if not user_email: raise credentials_exception
    
    except jwt.JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db=db, email=user_email) 

    if not user: raise credentials_exception

    return user        


@app.get("/")
def read_root():
    return {"message": "Willkommen bei SmartRecipe!"}


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Prüfen, ob Email schon existiert
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if not crud.use_invite_code(db=db, code=user.invite_code):
        raise HTTPException(status_code=400, detail="Invalid Invite Code")
    
    # 2. User erstellen
    return crud.create_user(db=db, user=user)



@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    # 1. User aus der Datenbank suchen
    user = crud.get_user_by_email(db, email=form_data.username)

    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.", headers={"WWW-Authenticate": "Bearer"},)
    
    # 3. Token erstellen
    access_token = create_access_token(data={"sub": user.email})
    
    # 4. Token gemäß dem Token-Schema zurückgeben
    return {"access_token": access_token, "token_type": "bearer"}



@app.get("/users/me", response_model= schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.post("/recipes/", response_model=schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_recipe(db=db, item=recipe, user_id=current_user.id)


@app.get("/recipes/", response_model=List[schemas.Recipe])
def get_recipes(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    recipes = crud.get_recipes(db=db, skip=skip, limit= limit, user_id=current_user.id)
    return recipes


@app.get("/recipes/{recipe_id}", response_model=schemas.Recipe)
def get_recipe_by_id(recipe_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    recipe = crud.get_recipe_by_id(user_id=current_user.id, db=db, recipe_id=recipe_id)
    
    if not recipe:
        raise HTTPException(status_code=404, detail="Not Found")
    
    return recipe

#neu
@app.post("/recipes/from-url", response_model=schemas.Recipe)
def create_recipe_from_url(url: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):

    
    # 1. Daten asynchron laden (await statt asyncio.run)
    if "tiktok.com" in url:
        data = tiktok_content_generator.transcribe_and_generate(url)
    else:
        data = website_content_generator.scrape_and_generate(url)
    
    # 2. In Pydantic-Schema umwandeln
    # WICHTIG: 'content' im Schema erwartet ein Dictionary/Objekt, keinen String!
    # Wir nutzen data.get("content", data), falls Gemini die Struktur flach oder verschachtelt liefert.
    recipe_content = data.get("content", data)
    recipe_image = data.get("image")
    
    recipe_in = schemas.RecipeCreate(title=data.get("title", "Unbekannt"), content=recipe_content, url=url, image=recipe_image)

    # 3. In DB speichern (user_id korrekt übergeben)
    return crud.create_recipe(db=db, item=recipe_in, user_id=current_user.id)


@app.delete("/recipes/{recipe_id}", response_model=dict)
def delete_recipe(recipe_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not crud.delete_recipe(recipe_id=recipe_id, user_id=current_user.id, db=db):
        raise HTTPException(status_code=404, detail="Not Found")
    
    return {"detail": "Recipe deleted"}


@app.post("/invite-code", response_model=dict)
def create_invite_code(code: str, db: Session = Depends(get_db)):
    crud.create_invite_code(db=db,code=code)

    return {"detail": "Invite Code created"}

@app.put("/recipes/{recipe_id}", response_model=schemas.Recipe)
def update_recipe(recipe_id: int, updates: schemas.RecipeUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    updated_recipe = crud.update_recipe(recipe_id=recipe_id, updates=updates, db=db, user_id=current_user.id)
    if not updated_recipe:
        raise HTTPException(status_code=404, detail="Not Found")
    
    return updated_recipe
    
