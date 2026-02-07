import json
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
from services.ai_image_generator import generate_image



load_dotenv()


api_key  =os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

conf = types.GenerateContentConfig(
        response_mime_type="application/json",
        temperature=0.1
    )


def call_gemini(html_content: str) -> dict:


    prompt = f"""
    ROLLE:
    Du bist ein professioneller Rezept-Redakteur für eine Koch-App.
    Deine Aufgabe ist es, unstrukturierten HTML-Rezepttext in ein sauberes,
    standardisiertes Rezeptformat zu überführen.

    INPUT HTML oder VIDEO DATEN (Beschreibung + Audiotranskript):
    {html_content}

    STYLE GUIDE (Befolge diese Regeln strikt!):

    1. SPRACHE:
    - Schreibe jeden Arbeitsschritt im Imperativ (Du-Form).
    - Verwende NIEMALS Passivformen.

    2. MENGEN:
    - Wandle Brüche in Dezimalzahlen um (1/2 → 0.5).
    - Verwende ausschließlich diese Einheiten: g, kg, ml, l, EL, TL, Prise, Stück, Bund, Scheibe, Blatt
    - Falls keine Einheit angegeben ist, lasse sie leer.

    3. INHALT:
    - Entferne persönliche Anekdoten.
    - Entferne Marken- und Produktnamen.
    - Halte Zutatennamen kurz, entferne unnötige Zusatzinfos.
    - Fasse logisch zusammengehörige Schritte zusammen.
    - Schätze wie viele Minuten die Zubereitung in Minuten braucht (5er Schritte).

    4. TITEL:
    - Gib dem Rezept einen sachlichen, neutralen Titel, der den Gerichtstyp beschreibt.
    - Entferne Adjektive wie "Omas Lieblings", "super lecker", "bestes", "traditionell" usw.
    - Behalte bekannte Eigennamen nur, wenn sie relevant sind (z.B. „Spaghetti alla Carbonara“ darf bleiben).
    - Variationen sind erlaubt, aber der Titel muss **klar und verständlich** sein.

    OUTPUT FORMAT:
    Gib ausschließlich ein gültiges JSON-Objekt mit genau diesen Feldern zurück:

    title: string
    content:
        ingredients: Liste von Zutatenobjekten mit
            name: string
            amount: number oder null
            unit: string oder null
        steps: Liste von Strings
        cooking_time: number (minutes)

    WICHTIG:
    - Kein Markdown.
    - Keine Codeblöcke.
    - Keine Erklärungen.
    - Nur reines JSON als Antwort.
    """




    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=conf
    )

    data = json.loads(response.text)

    image = generate_image(client=client, recipe=data)

    data["image"] = image

    return data
