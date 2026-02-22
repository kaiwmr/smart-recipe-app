from unittest.mock import patch
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
            "nutrients": None
        },
        "image": "fake_base64"
    }

    # 3. Services patchen
    with patch("services.ai_content_normalizer.call_gemini", return_value=mock_ai_data):
        with patch("services.website_content_generator.scrape_and_generate", return_value=mock_ai_data):

            response = await client.post(
                "/recipes/from-url?url=https://test.de",
                headers=headers
            )

            assert response.status_code == 200
            assert response.json()["title"] == "Test Pasta"