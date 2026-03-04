from unittest.mock import patch, AsyncMock
from main import create_access_token

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

    # 2. Mock-Daten 
    mock_ai_data = {
        "title": "Test Pasta",
        "content": {
            "servings": 2,
            "ingredients": [],
            "steps": ["Koch es"],
            "cooking_time": 20,
            "tags": ["Hauptspeise"],
            "nutrients": {
                "kcal": 0, "protein": 0, "fat": 0, "saturated_fat": 0,
                "carbs": 0, "sugar": 0, "fiber": 0, "salt": 0
            }
        },
        "image": "fake_base64"
    }

    # 3. Services patchen
    with patch("services.ai_content_normalizer.call_gemini", new_callable=AsyncMock) as mock_gemini:
        with patch("services.website_content_generator.scrape_and_generate", new_callable=AsyncMock) as mock_scrape:

            mock_gemini.return_value = mock_ai_data
            mock_scrape.return_value = mock_ai_data

            response = await client.post(
                "/recipes/from-url?url=https://test.de",
                headers=headers
            )

            assert response.status_code == 200
            assert response.json()["title"] == "Test Pasta"