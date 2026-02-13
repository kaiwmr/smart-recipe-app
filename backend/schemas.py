from pydantic import BaseModel, field_serializer
from typing import List, Optional
import base64

# 1. Basis-Schema (Daten, die wir immer brauchen)
class UserBase(BaseModel):
    email: str

# 2. Schema für die Erstellung (Input vom Nutzer)
# Hier brauchen wir zusätzlich das Passwort
class UserCreate(UserBase):
    password: str
    invite_code: str

# 3. Schema für die Antwort (Output an den Nutzer)
# Hier geben wir die ID zurück, aber KEIN Passwort!
class User(UserBase):
    id: int

    # Wichtig: Damit Pydantic versteht, dass es Daten auch
    # aus dem SQLAlchemy-Modell lesen darf (nicht nur aus Dictionaries).
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


#neu
class Nutrients(BaseModel):
    kcal: float
    protein: float
    fat: float
    saturated_fat: float
    carbs: float
    sugar: float
    fiber: float
    salt: float

class Ingredient(BaseModel):
    name: str
    amount: Optional[float] = None
    unit: Optional[str] = None
    id_slug: str
    search_term: str
    est_weight_g: float
    per_100g: Nutrients


class RecipeContent(BaseModel):
    servings: int
    ingredients: List[Ingredient]
    steps: List[str]
    cooking_time: int
    tags: List[str]
    nutrients: Optional[Nutrients] = None

class RecipeBase(BaseModel):
    title: str
    content: RecipeContent #neu
    url: str
    image: str


class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(RecipeBase):
    pass

class Recipe(RecipeBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True
