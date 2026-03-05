from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
import models, schemas, crud
from database import get_db
from routers.auth import get_current_user

users_router = APIRouter()

@users_router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # 1. Prüfen, ob Email schon existiert
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if not crud.use_invite_code(db=db, code=user.invite_code):
        raise HTTPException(status_code=400, detail="Invalid Invite Code")
    
    # 2. User erstellen
    return crud.create_user(db=db, user=user)

@users_router.get("/me", response_model= schemas.User)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user