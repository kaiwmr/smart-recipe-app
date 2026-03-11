from google.genai import types
import os
from utils import image_utils


async def generate_image(client, recipe: dict) -> str:

    prompt = f"""Rezept: {recipe}
    Erstelle ein Bild im identischen Studio-Stil wie das Referenzbild und beachte das Essen passend zum Rezept darzustellen.
    Behalte denselben Hintergrund (gleicher Tisch, gleiche Oberfläche, gleiche Farbe und Textur) bei.
    Die Beleuchtung, Kameraposition, Perspektive und Bildstimmung sollen wirken, als wäre das Foto im selben Studio und in derselben Fotosession aufgenommen worden.
    Behalte den Hauptteller, so wie bei dem Referenzbild, stets mittig an exakt der gleichen Position vom Bild.
    Halte auch Format und Auflösung exakt identisch.

    Die Teller dürfen anders angeordnet sein oder es dürfen zusätzliche Teller hinzugefügt werden (oder entfernt werden),
    sofern sie stilistisch zur gleichen Geschirrserie gehören. Der Hauptteller muss immer exakt an der gleichen Position stehen, so wie im Referenzbild.

    Der Fokus liegt auf einem anderen Gericht.
    Hintergrund, Lichtstil und Gesamtästhetik sollen konsistent bleiben.
    """

    reference_image = os.path.join(os.path.dirname(os.path.abspath(__file__)), "style_reference.jpg")

    with open(reference_image, "rb") as f:
        reference_part = types.Part(
            inline_data=types.Blob(
                mime_type="image/jpg",
                data=f.read()
            )
        )

    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash-image",
        contents=[
            prompt,
            reference_part
        ]
    )


    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            image_bytes = part.inline_data.data
            image_path = await image_utils.process_image_bytes(image_bytes)
            return image_path
