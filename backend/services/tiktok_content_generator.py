from openai import AsyncOpenAI
import asyncio
import tempfile
from services import ai_content_normalizer
import httpx
import yt_dlp
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type, retry_if_exception
from config import settings

openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


# Erlaubte Fehler für einen Retry:
RETRY_EXCEPTIONS = (httpx.TimeoutException, httpx.ConnectError, ValueError)

# Filterfunktion: nur bei 5xx HTTPStatusError retryen
def retry_if_server_error(exc):
    return isinstance(exc, httpx.HTTPStatusError) and 500 <= exc.response.status_code < 600

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2),
    retry=retry_if_exception_type(RETRY_EXCEPTIONS) | retry_if_exception(retry_if_server_error),
    reraise=True
)
async def transcribe_and_generate(url: str) -> dict:

    oembed_url = f"https://www.tiktok.com/oembed?url={url}"

    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(oembed_url)
        response.raise_for_status() # Fehlercodes (400, 401, 403, 404, 500 usw.) -> HTTPError wird ausgelöst
        oembed_data = response.json()

    video_description = oembed_data["title"]

    with tempfile.TemporaryDirectory() as tmpdir:
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": f"{tmpdir}/%(id)s.%(ext)s",
            "quiet" : True
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = await asyncio.to_thread(ydl.extract_info, url, download=True)
            audio_path = await asyncio.to_thread(ydl.prepare_filename, info)

        with open(audio_path, "rb") as audio_file:
            transcription = await openai_client.audio.transcriptions.create(
                model="gpt-4o-transcribe", 
                file=audio_file
            )
        audio_transcript = transcription.text

    video_data = f"Videobeschreibung: {video_description} | Audio: {audio_transcript}"
    
    recipe_data = await ai_content_normalizer.call_gemini(video_data)
    return recipe_data
