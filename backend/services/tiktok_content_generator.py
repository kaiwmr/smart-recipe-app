import os
from openai import AsyncOpenAI
import tempfile
import services.ai_content_normalizer as ai_content_normalizer
from dotenv import load_dotenv
import httpx
import yt_dlp

load_dotenv()
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def transcribe_and_generate(url: str) -> dict:

    oembed_url = f"https://www.tiktok.com/oembed?url={url}"

    async with httpx.AsyncClient() as http_client:
        response = await http_client.get(oembed_url)
        oembed_data = response.json()

    video_description = oembed_data["title"]

    with tempfile.TemporaryDirectory() as tmpdir:
        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": f"{tmpdir}/%(id)s.%(ext)s",
            "quiet" : True
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            audio_path = ydl.prepare_filename(info)  

        with open(audio_path, "rb") as audio_file:
            transcription = await openai_client.audio.transcriptions.create(
                model="gpt-4o-transcribe", 
                file=audio_file
            )
        audio_transcript = transcription.text

    video_data = f"Videobeschreibung: {video_description} | Audio: {audio_transcript}"
    
    recipe_data = await ai_content_normalizer.call_gemini(video_data)
    return recipe_data
