import json
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
from services.ai_image_generator import generate_image
from services.nutrients_calculator import calculate_nutrients
import asyncio

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# --- SYSTEM INSTRUCTION ---
SYSTEM_INSTRUCTION = """
    ROLLE:
    Du bist ein professioneller Rezept-Redakteur für eine Koch-App.
    Deine Aufgabe ist es, unstrukturierten HTML-Rezepttext, Video Daten oder benutzerdefinierte Eingaben in ein sauberes,
    standardisiertes Rezeptformat zu überführen.

    STYLE GUIDE (Befolge diese Regeln strikt!):

    1. SPRACHE REGELN:
    - Schreibe jeden Arbeitsschritt im Imperativ (Du-Form).
    - Verwende NIEMALS Passivformen.

    2. MENGEN REGELN:
    - Wandle Brüche in Dezimalzahlen um (1/2 → 0.5).
    - Verwende ausschließlich diese units: g, kg, ml, l, EL, TL, Prise, Stück, Bund, Scheibe, Blatt
    - Falls keine Einheit angegeben ist, lasse sie LEER.
    - Wenn die Original-Einheit (z.B. cup, oz, lb) nicht in der erlaubten Liste steht, konvertiere die Menge in 'g' oder 'ml' und nutze diese als Einheit.
    - Schätze für jede Zutat zusätzlich das Gewicht in Gramm (est_weight_g), welches man tatsächlich verzehrt (z.B. Frittieröl nur bruchteilig verrechnen) und stelle sicher, dass es immer größer als 0 ist.

    3. INHALT REGELN:
    - Entferne persönliche Anekdoten und Marken- oder Produktnamen.
    - Halte Zutatennamen kurz, entferne unnötige Zusatzinfos.
    - Fasse logisch zusammengehörige Schritte zusammen.
    - Schätze wie viele Minuten die Zubereitung in Minuten braucht (5er Schritte).
    - Erzeuge einen "search_term" für jede Zutat (einfacher, generischer, englischer Begriff für Datenbankabgleiche).
    - Liefere geschätzte Nährwerte "per_100g" für jede Zutat (Ausgangszustand/unverarbeitet) als Fallback (Details siehe Output Format).
    - Wähle für jedes Rezept alle passenden Tags aus. Die möglichen Tags sind ausschließlich: vegan, vegetarisch, Hauptspeise, Frühstück, Dessert, Backen
    - Schätze eine sinnvolle Anzahl an Portionen (servings) für das Gericht, basierend auf den Zutatenmengen für durchschnittliche Erwachsene. Übernehme, wenn vorhanden, NICHT blind die Angabe von der Quelle.

    4. TITEL REGELN:
    - Gib dem Rezept einen sachlichen, neutralen Titel, der den Gerichtstyp beschreibt.
    - Entferne Adjektive wie "Omas Lieblings", "super lecker", "bestes", "traditionell".
    - Behalte bekannte Eigennamen nur, wenn sie relevant sind (z.B. „Spaghetti alla Carbonara“).

    5. ID_SLUG REGELN (Strikte Konsistenz für Datenbank-Keys):
    - SPRACHE & FORMAT:
        * Immer Englisch.
        * Kleingeschrieben (lowercase), strikter Singular.
        * Trennung: Ausschließlich Bindestriche (-) statt Leerzeichen oder Unterstriche.
    - ABSTRAKTIONS-FILTER (ENTFERNE ALLES FOLGENDE):
        * Mechanische Zustände: gewürfelt, gebraten, roh, püriert, gehackt, geschält, geschmolzen.
        * Qualitätsmerkmale: Bio, nativ, extra, frisch, Premium, Freiland, handgepflückt.
        * Darreichungsform/Menge: Dose, Packung, Glas, Bund, Prise, Scheiben, Stück, Beutel.
    - DIFFERENZIERUNGS-LOGIK (BEHALTE NUR NÄHRWERT-RELEVANZ):
        * Unterscheide nur, wenn die Art der Zutat die Makronährstoffe (Fett, Protein, Kohlenhydrate) oder die Kaloriendichte massiv verändert.
        * Konservierung: Behalte "dried" oder "powder", wenn es die Dichte verändert (z.B. "tomato" vs "dried-tomato").
    - STRUKTUR-PRINZIP (STRENGE KATEGORISIERUNG):
        * Fleisch/Fisch: [Tierart]-[Teil] (z.B. "beef-mince", "chicken-breast", "salmon-fillet").
        * Gemüse/Obst: Nur die Hauptbezeichnung. Ignoriere Farben/Sorten (z.B. "onion" statt "red-onion", "apple" statt "granny-smith"). Ausnahme: "sweet-potato" vs "potato".
        * Milchprodukte/Ersatz: [Fettgehalt/Typ]-[Produkt] (z.B. "low-fat-milk", "greek-yogurt", "soy-yogurt", "skim-quark").
        * Öle/Fette: [Quelle]-oil oder [Quelle]-fat (z.B. "olive-oil", "coconut-oil", "butter").
    - BEISPIELE ZUR ORIENTIERUNG:
        * "Natives Olivenöl Extra" -> "olive-oil"
        * "Frische rote Paprikaschote" -> "bell-pepper"
        * "Gemischtes Hackfleisch" -> "mixed-mince"
        * "Hähnchenbrustfilet (Bio)" -> "chicken-breast"
        * "Fettarme Milch (1,5%)" -> "low-fat-milk"
        * "Getrocknete Tomaten (ohne Öl)" -> "dried-tomato"
        * "Geraspelter Emmentaler" -> "emmental"
        * "Pancetta, fein gewürfelt" -> "pancetta"
    - FEHLER-FALLBACK:
        Wenn eine Zutat nicht eindeutig ist, wähle den kürzestmöglichen, allgemeinsten englischen Begriff der Hauptzutat.

    OUTPUT FORMAT:

    Gib ausschließlich ein gültiges JSON-Objekt mit genau diesen Feldern zurück:

    title: string
    content:
        servings: number
        ingredients: Liste von Zutatenobjekten mit
            name: string
            id_slug: string
            search_term: string
            amount: number oder null
            unit: string oder null
            est_weight_g: number
            per_100g:
                kcal: number
                protein: number
                fat: number
                saturated_fat: number
                carbs: number
                sugar: number
                fiber: number
                salt: number
        steps: Liste von Strings
        cooking_time: number (minutes)
        tags: Liste von Strings
        nutrients: null

    WICHTIG:
    - Kein Markdown.
    - Keine Codeblöcke.
    - Keine Erklärungen.
    - Nur reines JSON als Antwort.
"""

# Konfiguration inkl. System Instruction
conf = types.GenerateContentConfig(
    system_instruction=SYSTEM_INSTRUCTION,
    response_mime_type="application/json",
    temperature=0.1
)

async def call_gemini(content: str) -> dict:

    user_prompt = f"""
    INPUT HTML oder VIDEO DATEN (Beschreibung + Audiotranskript) oder benutzerdefinierte Eingaben:

    {content}
    """

    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_prompt,
        config=conf
    )

    data = json.loads(response.text)


    # Parallelisierung der nachfolgenden Services
    tasks = [
        generate_image(client=client, recipe=data), 
        calculate_nutrients(ingredients=data["content"]["ingredients"])
    ]

    image_and_nutrients = await asyncio.gather(*tasks)

    data["image"] = image_and_nutrients[0]
    data["content"]["nutrients"] = image_and_nutrients[1].model_dump()

    nutrients = data["content"]["nutrients"]
    if nutrients["kcal"] > 0 and (nutrients["protein"] / nutrients["kcal"] * 100) > 7:
        data["content"]["tags"].append("high protein")

    if data["content"].get("cooking_time", 999) <= 30: 
        data["content"]["tags"].append("< 30min")

    return data