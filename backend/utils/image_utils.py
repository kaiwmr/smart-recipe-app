import uuid
import io
from pathlib import Path
from PIL import Image
import asyncio
from config import settings

UPLOAD_DIR = settings.UPLOAD_DIR

# Synchroner Helfer für die CPU intensive Bildverarbeitung
def _save_image_sync(image_data: bytes, upload_dir: Path) -> str:
    with Image.open(io.BytesIO(image_data)) as img:
        # Falls das Bild Transparenz hat (RGBA/P), für JPEG zu RGB konvertieren
        if img.mode != "RGB":
            img = img.convert("RGB")

        filename = f"{uuid.uuid4().hex}.jpg"
        filepath = upload_dir / filename
        
        img.save(filepath, "JPEG", optimize=True, quality=80)
        return f"/uploads/{filename}"

# Verarbeitet Bild-Bytes asynchron, ohne den Event-Loop zu blockieren
async def process_image_bytes(image_data: bytes) -> str:
    upload_dir = Path(UPLOAD_DIR)
    return await asyncio.to_thread(_save_image_sync, image_data, upload_dir)