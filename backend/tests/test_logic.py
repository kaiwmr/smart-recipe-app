from services.nutrients_calculator import calculate_nutrients

async def test_nutrients_math():

    mock_ingredients = [
        {
            "id_slug": "banana",
            "est_weight_g": 250,
            "per_100g": {
                "kcal": 100,
                "protein": 1,
                "fat": 0,
                "saturated_fat": 0,
                "carbs": 20,
                "sugar": 10,
                "fiber": 2,
                "salt": 0
            }
        }
    ]

    result = await calculate_nutrients(mock_ingredients)

    assert result.kcal == 250
    assert result.fiber == 5



