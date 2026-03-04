import schemas
from crud import create_nutrients, get_nutrients_by_id
from database import SessionLocal
import asyncio

def _fetch_or_create_nutrients(ing: dict):
    with SessionLocal() as db:
        nutrients = get_nutrients_by_id(ing["id_slug"], db)
        if not nutrients:
            nutrients = create_nutrients(db, ing["id_slug"], ing["per_100g"])
            
        return {
            "kcal": nutrients.kcal, "protein": nutrients.protein, 
            "fat": nutrients.fat, "saturated_fat": nutrients.saturated_fat,
            "carbs": nutrients.carbs, "sugar": nutrients.sugar, 
            "fiber": nutrients.fiber, "salt": nutrients.salt
        }

async def calculate_nutrients(ingredients: list) -> schemas.Nutrients:

    total_nutrients = {"kcal": 0.0,
                  "protein": 0.0,
                  "fat": 0.0,
                  "saturated_fat": 0.0,
                  "carbs": 0.0,
                  "sugar": 0.0,
                  "fiber": 0.0,
                  "salt": 0.0}

    for ing in ingredients:

        nutrients_data = await asyncio.to_thread(_fetch_or_create_nutrients, ing)

        weight_factor = ing.get("est_weight_g", 0) / 100.0

        total_nutrients["kcal"] += nutrients_data["kcal"] * weight_factor
        total_nutrients["protein"] += nutrients_data["protein"] * weight_factor
        total_nutrients["fat"] += nutrients_data["fat"] * weight_factor
        total_nutrients["saturated_fat"] += nutrients_data["saturated_fat"] * weight_factor
        total_nutrients["carbs"] += nutrients_data["carbs"] * weight_factor
        total_nutrients["sugar"] += nutrients_data["sugar"] * weight_factor
        total_nutrients["fiber"] += nutrients_data["fiber"] * weight_factor
        total_nutrients["salt"] += nutrients_data["salt"] * weight_factor
        
    return schemas.Nutrients(**total_nutrients)

    