from unittest.mock import patch, AsyncMock, MagicMock
from routers.auth import create_access_token

async def test_create_recipe_from_website_url_mocked(client, db_session):
    # 1. User manuell erstellen
    from crud import create_user
    from schemas import UserCreate

    user = create_user(
        db_session,
        UserCreate(email="chef@test.de", password="123", invite_code="X")
    )

    token = create_access_token({"sub": user.email})
    headers = {"Authorization": f"Bearer {token}"}

    mock_ai_data = {
        "title": "Test Pasta",
        "content": {
            "servings": 2,
            "ingredients": [],
            "steps": ["Koch es"],
            "cooking_time": 20,
            "tags": ["Hauptspeise"],
            "nutrients": {
                "kcal": 100, "protein": 10, "fat": 2, "saturated_fat": 0,
                "carbs": 10, "sugar": 1, "fiber": 1, "salt": 0
            }
        },
        "image": "fake_base64"
    }

    # Mock für das Datenbank-Objekt, das crud.create_recipe normalerweise zurückgibt
    mock_recipe_db = MagicMock()
    mock_recipe_db.id = 1
    mock_recipe_db.title = "Test Pasta"
    mock_recipe_db.url = "https://test.de"
    mock_recipe_db.image = "fake_base64"
    mock_recipe_db.owner_id = user.id
    mock_recipe_db.content = mock_ai_data["content"]

    # 3. Services patchen
    # WICHTIG: Pfade müssen auf "main" zeigen, da dort die Imports liegen
    with patch("routers.recipes.website_content_generator.scrape_and_generate", new_callable=AsyncMock) as mock_scrape:
        with patch("routers.recipes.crud.create_recipe") as mock_crud:
            
            mock_scrape.return_value = mock_ai_data
            mock_crud.return_value = mock_recipe_db

            response = await client.post(
                "/recipes/from-url?url=https://test.de",
                headers=headers
            )

            assert response.status_code == 200
            data = response.json()
            assert data["title"] == "Test Pasta"
            assert data["id"] == 1