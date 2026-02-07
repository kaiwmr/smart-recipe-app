from typing import Optional
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import models
import schemas
from typing import List

# Setup für das Passwort-Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")





# Hilfsfunktion: Passwort hashen
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_user_by_email(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    # 1. Passwort verschlüsseln
    hashed_password = get_password_hash(user.password)
    
    # 2. Datenbank-Modell befüllen
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    
    # 3. Zur DB hinzufügen und speichern
    db.add(db_user)
    db.commit()      # Bestätigen ("Enter drücken")
    db.refresh(db_user) # Daten neu laden (um die generierte ID zu bekommen)
    
    return db_user


def create_recipe(db: Session, item: schemas.RecipeCreate, user_id: int) -> models.Recipe:

    db_recipe = models.Recipe(**item.model_dump(), owner_id=user_id)

    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)

    return db_recipe


def get_recipes(user_id: int, db: Session, skip: int = 0, limit: int = 100) -> List[models.Recipe]:
    return db.query(models.Recipe).filter(models.Recipe.owner_id == user_id).offset(skip).limit(limit).all()

def get_recipe_by_id(user_id: int, db: Session, recipe_id: int) -> models.Recipe:
    return db.query(models.Recipe).filter(models.Recipe.id == recipe_id, models.Recipe.owner_id == user_id).first()



def delete_recipe(db:Session, recipe_id: int, user_id: int) -> bool:

    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id, models.Recipe.owner_id == user_id).first()

    if db_recipe:
        db.delete(db_recipe)
        db.commit()
        return True
    
    return False



def create_invite_code(db: Session, code: str) -> models.InviteCode:
    db_invite_code = models.InviteCode(code=code, usages=10)

    db.add(db_invite_code)
    db.commit()
    db.refresh(db_invite_code)

    return db_invite_code

def get_invite_code(db:Session, code: str) -> models.InviteCode:
    return db.query(models.InviteCode).filter(models.InviteCode.code == code).first()

def use_invite_code(db: Session, code: str) -> bool:

    db_invite_code = db.query(models.InviteCode).filter(models.InviteCode.code == code).first()

    if not db_invite_code or db_invite_code.usages <= 0:
        return False
    
    db_invite_code.usages -= 1

    if db_invite_code.usages <= 0:
        db.delete(db_invite_code)
        db.commit()
    else:
        db.commit()
        db.refresh(db_invite_code)

    return True


def update_recipe(updates: schemas.RecipeUpdate, db:Session, recipe_id: int, user_id: int) -> bool:

    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id, models.Recipe.owner_id == user_id).first()

    if not db_recipe:
        return None
    
    # 2. Felder aktualisieren
    # Wir kopieren die Werte aus dem Schema in das Datenbank-Objekt
    update_data = updates.model_dump(exclude_unset=True)
    
    # Hier passiert die Magie: Wir updaten Titel, Content, URL gleichzeitig
    for key, value in update_data.items():
        setattr(db_recipe, key, value)
    
    db.commit()
    db.refresh(db_recipe)
    return db_recipe
    