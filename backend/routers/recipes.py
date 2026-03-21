from fastapi import Depends, HTTPException, APIRouter, Request
from sqlalchemy.orm import Session
import models, schemas, crud
from services import website_content_generator
from services import tiktok_content_generator
from services import user_content_generator
from database import get_db
from fastapi.concurrency import run_in_threadpool
from typing import List
from routers.auth import get_current_user
from limiter import limiter

recipe_router = APIRouter()

@recipe_router.post("/", response_model=schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.create_recipe(db=db, item=recipe, user_id=current_user.id)

@recipe_router.get("/", response_model=List[schemas.Recipe])
def get_recipes(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    recipes = crud.get_recipes(db=db, skip=skip, limit= limit, user_id=current_user.id)
    return recipes

@recipe_router.get("/{recipe_id}", response_model=schemas.Recipe)
def get_recipe_by_id(recipe_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    recipe = crud.get_recipe_by_id(user_id=current_user.id, db=db, recipe_id=recipe_id)
    
    if not recipe:
        raise HTTPException(status_code=404, detail="Not Found")
    
    return recipe

@recipe_router.post("/from-url", response_model=schemas.Recipe)
@limiter.limit("3/minute")
async def create_recipe_from_url(request: Request, url: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):

    data = await run_in_threadpool(crud.get_recipe_by_url, db=db, url=url)
    if not data: 
        try:
            if "tiktok.com" in url:
                data = await tiktok_content_generator.transcribe_and_generate(url)
            else:
                data = await website_content_generator.scrape_and_generate(url)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))

    # 2. In Pydantic-Schema umwandeln
    # WICHTIG: 'content' im Schema erwartet ein Dictionary/Objekt, keinen String!
    # Wir nutzen data.get("content", data), falls Gemini die Struktur flach oder verschachtelt liefert.
    recipe_title = data.get("title", "Unbekannt")
    recipe_content = data.get("content")
    recipe_image = data.get("image")

    
    recipe_in = schemas.RecipeCreate(title=recipe_title, content=recipe_content, url=url, image=recipe_image)

    # 3. In DB speichern (user_id korrekt übergeben)
    return await run_in_threadpool(crud.create_recipe, db=db, item=recipe_in, user_id=current_user.id)


@recipe_router.post("/from-user-input", response_model=schemas.Recipe)
@limiter.limit("3/minute")
async def create_recipe_from_user_input(request: Request, input_data: schemas.UserInput, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):

    try:
        data = await user_content_generator.generate_from_input(user_input=input_data.user_input)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    recipe_title = data.get("title", "Unbekannt")
    recipe_content = data.get("content")
    recipe_image = data.get("image")

    
    recipe_in = schemas.RecipeCreate(title=recipe_title, content=recipe_content, image=recipe_image)

    # 3. In DB speichern (user_id korrekt übergeben)
    return await run_in_threadpool(crud.create_recipe, db=db, item=recipe_in, user_id=current_user.id)


@recipe_router.delete("/{recipe_id}", response_model=dict)
def delete_recipe(recipe_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not crud.delete_recipe(recipe_id=recipe_id, user_id=current_user.id, db=db):
        raise HTTPException(status_code=404, detail="Not Found")
    
    return {"detail": "Recipe deleted"}

@recipe_router.put("/{recipe_id}", response_model=schemas.Recipe)
def update_recipe(recipe_id: int, updates: schemas.RecipeUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    updated_recipe = crud.update_recipe(recipe_id=recipe_id, updates=updates, db=db, user_id=current_user.id)
    if not updated_recipe:
        raise HTTPException(status_code=404, detail="Not Found")
    
    return updated_recipe