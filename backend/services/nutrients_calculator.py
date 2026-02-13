import schemas
from crud import create_nutrients, get_nutrients_by_id
from database import SessionLocal

async def calculate_nutrients(ingredients: list) -> schemas.Nutrients:

    total_nutrients = {"kcal": 0.0,
                  "protein": 0.0,
                  "fat": 0.0,
                  "saturated_fat": 0.0,
                  "carbs": 0.0,
                  "sugar": 0.0,
                  "fiber": 0.0,
                  "salt": 0.0}

    with SessionLocal() as db:
        for ing in ingredients:
            nutrients = get_nutrients_by_id(ing["id_slug"], db)
            
            if not nutrients:
                nutrients = create_nutrients(db, ing["id_slug"], ing["per_100g"])

            weight_factor = ing.get("est_weight_g", 0) / 100.0

            total_nutrients["kcal"] += nutrients.kcal * weight_factor
            total_nutrients["protein"] += nutrients.protein * weight_factor
            total_nutrients["fat"] += nutrients.fat * weight_factor
            total_nutrients["saturated_fat"] += nutrients.saturated_fat * weight_factor
            total_nutrients["carbs"] += nutrients.carbs * weight_factor
            total_nutrients["sugar"] += nutrients.sugar * weight_factor
            total_nutrients["fiber"] += nutrients.fiber * weight_factor
            total_nutrients["salt"] += nutrients.salt * weight_factor
        
    return schemas.Nutrients(**total_nutrients)

    