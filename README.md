<div align="center">
  <h1>🍲 BiteWise</h1>
  <p><strong>A pipeline to extract, normalize, and generate recipes from unstructured web and video sources.</strong></p>

  <a href="https://github.com/kaiwmr/smart-recipe-app/actions/workflows/tests.yml">
    <img src="https://github.com/kaiwmr/smart-recipe-app/actions/workflows/tests.yml/badge.svg" alt="CI/CD Tests">
  </a>
  <a href="https://fastapi.tiangolo.com/">
    <img src="https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi" alt="FastAPI">
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
  </a>
  <a href="https://openai.com/">
    <img src="https://img.shields.io/badge/AI-OpenAI_Whisper-412991?style=flat-square&logo=openai" alt="OpenAI Whisper">
  </a>
  <a href="https://deepmind.google/technologies/gemini/">
    <img src="https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=flat-square&logo=google" alt="Gemini 3 Flash">
  </a>
</div>

<br />

> **BiteWise** handles the conversion of unstructured culinary data into a clean format. It scrapes recipe websites and TikTok videos, transcribes audio, normalizes content into structured JSON using LLMs, and generates missing assets like high-quality images.

<div align="center">
  <img src="docs/UI-preview.webp" alt="BiteWise UI Preview" width="800" />
</div>

---

## Key Features

The project focuses on parsing complex data streams while maintaining type-safety and API stability:

- **Recipe Extraction:** Scrapes data from standard culinary websites (`BeautifulSoup4`) and extracts audio from video platforms like TikTok (`yt-dlp`).
- **Transcription & Normalization:** Uses **OpenAI Whisper** for STT and LLMs with strict `pydantic` schemas to parse raw text into structured data (unit conversion, ingredient categorization).
- **Security:** JWT authentication using `HttpOnly` cookies to mitigate XSS risks. Includes Role-Based Access Control (RBAC) with an admin-only invite system.
- **Rate Limiting & Retries:** Implements `slowapi` for rate limiting and `tenacity` for exponential backoff retries on external API calls.
- **Asset Generation:** Uses **Gemini 2.5 Flash** to generate recipe images that follow a specific visual style reference.
- **Nutrient Calculation:** Automatically aggregates macronutrients based on extracted ingredients and portion sizes.

## Architecture

The system uses a decoupled Client-Server architecture with modularized FastAPI routers.

```text
[ Client (React 19 / TS) ]  <-- REST / HttpOnly Cookies -->  [ API Gateway (FastAPI) ]
                                                              ├──> Middleware (Rate Limiter / CORS)
                                                              ├──> Auth Router (JWT & RBAC)
                                                              ├──> Recipe Router (CRUD & DB)
                                                              └──> AI Processing Pipeline
                                                                   ├──> BeautifulSoup4 (Scraping)
                                                                   ├──> yt-dlp (Audio Fetching)
                                                                   ├──> Whisper API (Transcription)
                                                                   ├──> LLM Parsing (Normalization)
                                                                   └──> Gemini API (Image Gen)
```

## Tech Stack

| Category | Technologies |
| --- | --- |
| **Backend** | Python 3.10+, FastAPI, SQLAlchemy 2.0, Pydantic V2, Pytest |
| **Security** | `slowapi` (Rate Limiting), `tenacity` (Retries), `jose` (JWT) |
| **Frontend** | React 19, TypeScript, Vite, Axios, CSS Modules |
| **AI / Data** | OpenAI (Whisper), Google Gemini, `yt-dlp`, BeautifulSoup4 |

## Local Development

Requires **Python 3.10+**, **Node.js 18+**, and **FFmpeg**.

### 1. Clone & Setup
```bash
git clone [https://github.com/kaiwmr/smart-recipe-app.git](https://github.com/kaiwmr/smart-recipe-app.git)
cd smart-recipe-app
```

### 2. Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env
# EDIT .env: Add your API Keys and Database string.
```

**Bootstrapping the Admin:**
The app is invite-only. To create the first admin:
1. Temporarily set `is_admin = Column(Boolean, default=True)` in `backend/models.py`.
2. Register an account via the UI or Swagger.
3. Revert the code change and use the Swagger UI (`/docs`) to generate invite codes.

```bash
uvicorn main:app --reload
```

### 3. Frontend (React)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Testing

The backend includes a `pytest` suite using an isolated test database and mocked API responses to prevent unnecessary quota usage.

```bash
cd backend
pytest -v
```

## Roadmap

- [ ] **Alembic Migrations:** Add database schema versioning.
- [ ] **Background Tasks:** Integrate `Celery` + `Redis` for heavy processing (Video/Images).
- [ ] **Containerization:** Add `Dockerfile` and `docker-compose` for deployment.

---

**Developed by Kai Weismayr | [LinkedIn](https://www.linkedin.com/in/kai-weismayr-5610b234b/)**
