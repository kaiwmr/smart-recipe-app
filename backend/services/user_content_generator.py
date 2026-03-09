
from services import ai_content_normalizer

async def generate_from_input(user_input: str) -> dict:

    recipe_data = await ai_content_normalizer.call_gemini(user_input)

    return recipe_data




