from pydantic import BaseModel, ConfigDict
from typing import List, Optional

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    invite_code: str

class User(UserBase):
    id: int

    # Wichtig: Damit Pydantic versteht, dass es Daten auch
    # aus dem SQLAlchemy-Modell lesen darf (nicht nur aus Dicts).
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

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
    id_slug: Optional[str] = None
    search_term: Optional[str] = None
    est_weight_g: Optional[float] = 0.0
    per_100g: Optional[Nutrients] = None

class RecipeContent(BaseModel):
    servings: int
    ingredients: List[Ingredient]
    steps: List[str]
    cooking_time: int
    tags: List[str]
    nutrients: Optional[Nutrients] = None

class RecipeBase(BaseModel):
    title: str
    content: RecipeContent 

class RecipeCreate(RecipeBase):
    url: Optional[str] = ""
    image: str

class RecipeUpdate(RecipeBase):
    pass

class Recipe(RecipeCreate):
    id: int
    owner_id: int

    model_config = ConfigDict(from_attributes=True)

class UserInput(BaseModel):
    user_input: str