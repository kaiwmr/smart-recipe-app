from fastapi import HTTPException, Request, Depends, APIRouter, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from jose import jwt
import models, crud
from database import get_db
from datetime import datetime, timedelta, timezone
from config import settings

auth_router = APIRouter()

load_dotenv()

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_SECONDS = settings.ACCESS_TOKEN_EXPIRE_SECONDS

def create_access_token(data:dict) -> str:
    data_copy = data.copy()
    expire_time = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_SECONDS * 60)
    data_copy["exp"] = expire_time
    token = jwt.encode(data_copy, key= SECRET_KEY, algorithm=ALGORITHM)

    return token

def get_current_user(request: Request, db: Session = Depends(get_db)) -> models.User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"})

    token = request.cookies.get("access_token")
    if not token:
        raise credentials_exception
    
    try:
        token_data = jwt.decode(token, key= SECRET_KEY, algorithms=[ALGORITHM])
        user_email = token_data.get("sub")

        if not user_email: raise credentials_exception
    
    except jwt.JWTError:
        raise credentials_exception
    
    user = crud.get_user_by_email(db=db, email=user_email) 
    if not user:
        raise credentials_exception

    return user  

def is_user_admin(current_user: models.User = Depends(get_current_user)) -> models.User:
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user
    
@auth_router.post("/token", response_model=dict)
def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):

    # 1. User aus der Datenbank suchen
    user = crud.get_user_by_email(db, email=form_data.username)

    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password.", headers={"WWW-Authenticate": "Bearer"},)
    
    # 3. Token erstellen
    access_token = create_access_token(data={"sub": user.email})
    
    #4. Token als Cookie setzen
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,     # Verhindert XSS (JS hat keinen Zugriff)
        secure=True,       # Cookie wird nur über HTTPS gesendet
        samesite="none",   # Erlaubt Cookies über verschiedene Domains (Frontend vs Backend)
        path="/",
        max_age=ACCESS_TOKEN_EXPIRE_SECONDS * 60 # Ablaufzeit in Sekunden
    )
    
    return {"message": "Login successful"}

@auth_router.post("/logout", response_model=dict)
def delete_token(response: Response):

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )

    return {"message": "Logout successful"}



@auth_router.post("/invite-code", response_model=dict)
def create_invite_code(code: str, db: Session = Depends(get_db), admin: models.User = Depends(is_user_admin)):
    crud.create_invite_code(db=db,code=code)

    return {"detail": f"Invite Code '{code}' created successfully"}