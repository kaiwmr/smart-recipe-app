import json
from google import genai
from google.genai import types
from services.ai_image_generator import generate_image
from services.nutrients_calculator import calculate_nutrients
import asyncio
from config import settings


client = genai.Client(api_key=settings.GEMINI_API_KEY)

# --- RECIPE SCHEMA ---
recipe_schema = {
    "type": "OBJECT",
    "required": ["title", "visual_summary", "content"],
    "properties": {
        "title": {"type": "STRING"},
        "visual_summary": {"type": "STRING"},
        "content": {
            "type": "OBJECT",
            "required": ["servings", "ingredients", "steps", "cooking_time", "tags", "nutrients"],
            "properties": {
                "servings": {"type": "NUMBER"},
                "cooking_time": {"type": "NUMBER"},
                "nutrients": {"type": "NULL"}, 
                "steps": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"}
                },
                "tags": {
                    "type": "ARRAY",
                    "items": {
                        "type": "STRING",
                        "enum": ["vegan", "vegetarisch", "Hauptspeise", "Frühstück", "Dessert", "Backen", "Beilage"]
                    }
                },
                "ingredients": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "required": ["name", "id_slug", "search_term", "amount", "unit", "est_weight_g", "per_100g"],
                        "properties": {
                            "name": {"type": "STRING"},
                            "id_slug": {"type": "STRING"},
                            "search_term": {"type": "STRING"},
                            "amount": {"type": "NUMBER", "nullable": True},
                            "unit": {
                                "type": "STRING", 
                                "nullable": True, # Erlaubt null als Wert
                                "enum": ["g", "kg", "ml", "l", "EL", "TL", "Prise", "Stück", "Bund", "Scheibe", "Blatt"]
                            },
                            "est_weight_g": {"type": "NUMBER"},
                            "per_100g": {
                                "type": "OBJECT",
                                "required": ["kcal", "protein", "fat", "saturated_fat", "carbs", "sugar", "fiber", "salt"],
                                "properties": {
                                    "kcal": {"type": "NUMBER"},
                                    "protein": {"type": "NUMBER"},
                                    "fat": {"type": "NUMBER"},
                                    "saturated_fat": {"type": "NUMBER"},
                                    "carbs": {"type": "NUMBER"},
                                    "sugar": {"type": "NUMBER"},
                                    "fiber": {"type": "NUMBER"},
                                    "salt": {"type": "NUMBER"}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}


# --- SYSTEM INSTRUCTION ---
SYSTEM_INSTRUCTION = """
    ROLLE:
    Du bist ein professioneller Rezept-Redakteur für eine Koch-App.
    Deine Aufgabe ist es, unstrukturierten HTML-Rezepttext, Video Daten oder benutzerdefinierte Eingaben in ein sauberes,
    standardisiertes Rezeptformat zu überführen.
    Sollten die übergebenen Daten rein gar nichts mit einem Rezept zu tun haben, den übergebe als title exakt "No Recipe Found".

    STYLE GUIDE (Befolge diese Regeln strikt!):

    1. SPRACHE REGELN:
    - DEUTSCH: 'title', 'steps', 'tags' und 'ingredients[].name'.
    - ENGLISCH: 'visual_summary', 'id_slug' und 'search_term'.
    - Schreibe jeden Arbeitsschritt im Imperativ (Du-Form).
    - Verwende NIEMALS Passivformen.

    2. MENGEN REGELN:
    - Wandle Brüche in Dezimalzahlen um (1/2 → 0.5).
    - Falls keine Einheit angegeben ist, lasse sie LEER.
    - Einheiten dürfen nie alleine stehen, wenn eine Einheit vorhanden ist brauchst du auch zwangsweise eine Menge.
    - Wenn die Original-Einheit (z.B. cup, oz, lb, Dose, Packung, Glas, Tasse, Pck.) nicht in der erlaubten Liste steht, KONVERTIERE die Menge zwingend in 'g' oder 'ml'. 
    - Beispiel-Konvertierung: "1 Dose Bohnen" -> 240 g Bohnen, "1 Packung Feta" -> 200 g Feta, "1 cup Reis" -> 185 g Reis, "1 Pck. Vanillezucker" -> 8 g Vanillezucker.
    - Schätze für jede Zutat zusätzlich das Gewicht in Gramm (est_weight_g), welches man tatsächlich verzehrt (z.B. Frittieröl nur bruchteilig verrechnen) und stelle sicher, dass es immer größer als 0 ist.

    3. INHALT REGELN:
    - Entferne persönliche Anekdoten und Marken- oder Produktnamen.
    - Halte Zutatennamen kurz, entferne unnötige Zusatzinfos.
    - Fasse logisch zusammengehörige Schritte zusammen.
    - Schätze wie viele Minuten die Zubereitung in Minuten braucht (5er Schritte).
    - Erzeuge einen "search_term" für jede Zutat (einfacher, generischer, englischer Begriff für Datenbankabgleiche).
    - Liefere geschätzte Nährwerte "per_100g" für jede Zutat (Ausgangszustand/unverarbeitet) als Fallback.
    - TAG-LOGIK:
        * Prüfe vor dem Taggen die Zutaten. Wenn Fleisch (Rind, Schwein, Geflügel, Speck, Schinken, etc.) oder Fisch enthalten ist, lösche die Tags "vegan" und "vegetarisch" zwingend.
        * Jedes Rezept erhält genau eine primäre Mahlzeiten-Kategorie: Hauptspeise, Frühstück, Dessert oder Beilage. Wähle die Kategorie, die am besten beschreibt, wie das Gericht primär verzehrt wird. Diese schließen sich gegenseitig aus.
        * Nutze 'Backen' nur, wenn ein Teig im Ofen gegart/gebacken wird.
    - Schätze eine sinnvolle Anzahl an Portionen (servings) für das Gericht, basierend auf den Zutatenmengen für durchschnittliche Erwachsene. Übernehme, wenn vorhanden, NICHT blind die Angabe von der Quelle.

    4. TITEL REGELN:
    - Gib dem Rezept einen sachlichen, neutralen Titel, der den Gerichtstyp beschreibt und möglichst kurz ist.
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
        * "Hähnchenbrustfilet (Bio)" -> "chicken-breast"
        * "Fettarme Milch (1,5%)" -> "low-fat-milk"
        * "Getrocknete Tomaten (ohne Öl)" -> "dried-tomato"
        * "Geraspelter Emmentaler" -> "emmental"
        * "Pancetta, fein gewürfelt" -> "pancetta"
    - FEHLER-FALLBACK:
        Wenn eine Zutat nicht eindeutig ist, wähle den kürzestmöglichen, allgemeinsten englischen Begriff der Hauptzutat.

    6. VISUAL_SUMMARY REGELN:
    - Es ist KEIN KI-Prompt, sondern eine sachliche, präzise Beschreibung des fertigen Gerichts.
    - Beschreibe ausschließlich das Endergebnis, nicht die Zubereitung.
    - Beschreibe nur visuell erkennbare Eigenschaften:
        * Form der Zutaten (z.B. ganz, gewürfelt, in Scheiben, gerieben, püriert, geschichtet)
        * Konsistenz (z.B. cremig, knusprig, stückig, kompakt, locker, flüssig)
        * Farbe
        * Anordnung (vermischt, getrennt, geschichtet, Sauce darüber, Topping obenauf)
    - Beschreibe Formen nur, wenn sie aus den Arbeitsschritten eindeutig hervorgehen.
    - Erfinde keine zusätzlichen Zutaten, Garnituren oder Toppings.
    - Erwähne nur Zutaten, die im finalen Gericht sichtbar sind.
    - Erwähne alle Zutaten, die dazu beitragen, dass das Gericht optisch ansprechend angerichtet werden kann.
    - Keine Licht-, Kamera-, Styling- oder Fotografie-Begriffe.
    - Keine Wertungen oder emotionale Sprache.
    - Maximal 2-4 Sätze.
    - Neutral und rein beschreibend formulieren.

    OUTPUT:
    Fülle das hinterlegte JSON-Schema unter strikter Einhaltung der Logik-Regeln aus. 
    Gib ausschließlich das reine JSON-Objekt zurück.
"""

# --- CONFIG ---
conf = types.GenerateContentConfig(
    system_instruction=SYSTEM_INSTRUCTION,
    response_mime_type="application/json",
    response_schema=recipe_schema,
    temperature=0.1,
    thinking_config=types.ThinkingConfig(thinking_level="MINIMAL")
)

# --- FUNCTION CALL ---
async def call_gemini(content: str) -> dict:

    user_prompt = f"""
    INPUT HTML oder VIDEO DATEN (Beschreibung + Audiotranskript) oder benutzerdefinierte Eingaben:

    {content}
    """
    response = await client.aio.models.generate_content_stream(
        model="gemini-3-flash-preview",
        contents=user_prompt,
        config=conf
    )

    full_response = ""
    image_task = None
    image_function_triggered = False

    async for chunk in response:
        full_response += chunk.text

        if not image_function_triggered and '"content":' in full_response:
            if "No Recipe Found" in full_response:
                asyncio.create_task(response.aclose()) # beendet den Stream
                raise ValueError("No recipe found")
            image_task = asyncio.create_task(generate_image(client=client, recipe=full_response))
            image_function_triggered = True

    data = json.loads(full_response)

    nutrients = await calculate_nutrients(ingredients=data["content"]["ingredients"])

    if image_task:
        data["image"] = await asyncio.wait_for(image_task, timeout=25.0)
    else:
        data["image"] = None

    data["content"]["nutrients"] = nutrients.model_dump()

    nutrients = data["content"]["nutrients"]
    if nutrients["kcal"] > 0 and (nutrients["protein"] / nutrients["kcal"] * 100) > 6:
        data["content"]["tags"].append("high protein")

    if data["content"].get("cooking_time", 999) <= 30: 
        data["content"]["tags"].append("< 30min")

    return data