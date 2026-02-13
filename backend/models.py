from sqlalchemy import Column, Integer, String, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    # Tabellenname in der Datenbank
    __tablename__ = "users"

    # Spalten definieren
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    recipes = relationship("Recipe", back_populates="owner")


class Recipe(Base):

    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(JSON)
    url = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="recipes")
    image = Column(String)
    nutrients = Column(JSON)


class IngredientNutrients(Base):

    __tablename__ = "ingredient_nutrients"

    id_slug = Column(String, primary_key=True, index=True)
    kcal = Column(Float)
    protein = Column(Float)
    fat = Column(Float)
    saturated_fat = Column(Float)
    carbs = Column(Float)
    sugar = Column(Float)
    fiber = Column(Float)
    salt = Column(Float)


class InviteCode(Base):

    __tablename__ = "invite_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, index=True)
    usages = Column(Integer)
