import whisper
import yt_dlp
import tempfile
import requests
import services.ai_content_normalizer as ai_content_normalizer

model = whisper.load_model("small")

def transcribe_and_generate(url: str) -> dict:

    oembed_url = f"https://www.tiktok.com/oembed?url={url}"
    oembed_data = requests.get(oembed_url).json()
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

        audio_data = model.transcribe(audio_path)
        audio_transcript = audio_data["text"]

    video_data = f"Videobeschreibung: {video_description} | Audio: {audio_transcript}"
    
    recipe_data = ai_content_normalizer.call_gemini(video_data)
    return recipe_data




