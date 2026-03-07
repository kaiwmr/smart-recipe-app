<div align="center">
  <h1>🍲 BiteWise</h1>
  <p><strong>An AI-powered pipeline for multimodal recipe extraction, normalization, and generation.</strong></p>

  <a href="[https://github.com/kaiwmr/smart-recipe-app/actions/workflows/tests.yml](https://github.com/kaiwmr/smart-recipe-app/actions/workflows/tests.yml)"><img src="[https://github.com/kaiwmr/smart-recipe-app/actions/workflows/tests.yml/badge.svg](https://github.com/kaiwmr/smart-recipe-app/actions/workflows/tests.yml/badge.svg)" alt="CI/CD Tests"></a>
  <a href="[https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)"><img src="[https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi](https://img.shields.io/badge/FastAPI-005571?style=flat-square&logo=fastapi)" alt="FastAPI"></a>
  <a href="[https://react.dev/](https://react.dev/)"><img src="[https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)" alt="React 19"></a>
  <a href="[https://www.typescriptlang.org/](https://www.typescriptlang.org/)"><img src="[https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)" alt="TypeScript"></a>
  <a href="[https://openai.com/](https://openai.com/)"><img src="[https://img.shields.io/badge/AI-OpenAI_Whisper-412991?style=flat-square&logo=openai](https://img.shields.io/badge/AI-OpenAI_Whisper-412991?style=flat-square&logo=openai)" alt="OpenAI Whisper"></a>
  <a href="[https://deepmind.google/technologies/gemini/](https://deepmind.google/technologies/gemini/)"><img src="[https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=flat-square&logo=google](https://img.shields.io/badge/AI-Google_Gemini-8E75B2?style=flat-square&logo=google)" alt="Gemini 2.5 Flash"></a>
</div>

<br />

> **BiteWise** solves the problem of unstructured culinary data. It automatically scrapes standard websites and TikTok videos, extracts spoken or written instructions, normalizes them into structured JSON using Large Language Models, and generates missing assets (like studio-quality images) on the fly.

<div align="center">
  <img src="docs/UI-preview.webp" alt="BiteWise UI Preview" width="800" />
</div>

---

## ✨ Core Engineering Features

Unlike standard CRUD applications, BiteWise focuses on processing complex, unstructured data streams with a strong emphasis on security and resilience:

- 🌐 **Omni-Channel Recipe Extraction:** Automatically scrapes and extracts recipe data from standard culinary websites (via `BeautifulSoup4`) as well as extracting audio streams from short-form video platforms like TikTok (via `yt-dlp`).
- 🧠 **Speech-to-Text & AI Normalization:** Transcribes audio via **OpenAI Whisper** and utilizes LLMs with strict `pydantic` schemas and prompt engineering to normalize raw text into structured data (fraction-to-decimal conversion, ingredient categorization).
- 🛡️ **Enterprise-Grade Security:** Implements JWT authentication stored in strict `HttpOnly` cookies to prevent XSS attacks. Features Role-Based Access Control (RBAC) to manage an exclusive, admin-only invite-code system.
- 🏗️ **Resilience & Quota Protection:** Integrates a token-bucket rate limiter (`slowapi`) to protect expensive AI routes from abuse. Features smart, exponential backoff retries (`tenacity`) with fail-fast validation to gracefully handle external API timeouts and 5xx errors.
- 🎨 **Generative Assets:** Implements **Gemini 2.5 Flash** to dynamically generate high-quality recipe images matching a specific target style (`style_reference.png`), ensuring UI consistency.
- ⚙️ **Strict Configuration Management:** Uses `pydantic-settings` for robust, type-safe environment variable validation.
- 🥗 **Algorithmic Nutrient Calculation:** Automatically aggregates macronutrients dynamically based on extracted ingredients and user-defined portion sizes.

## 🏗 System Architecture

The project follows a decoupled Client-Server architecture, heavily modularized using FastAPI routers.

```text
[ Client (React 19 / TypeScript) ]  <-- REST / HttpOnly Cookies -->  [ API Gateway (FastAPI) ]
                                                                        ├──> Middleware (Rate Limiter / CORS)
                                                                        ├──> Auth Router (JWT & RBAC)
                                                                        ├──> Recipe Router (CRUD & DB)
                                                                        └──> AI Processing Pipeline
                                                                                ├──> BeautifulSoup4 (Web Scraping)
                                                                                ├──> yt-dlp (Video/Audio Fetching)
                                                                                ├──> Whisper API (Transcription)
                                                                                ├──> LLM Parsing (Normalization)
                                                                                └──> Gemini API (Image Gen)
```

## 🛠 Tech Stack

| Category | Technologies |
| --- | --- |
| **Backend** | Python 3.10+, FastAPI, SQLAlchemy 2.0, Pydantic V2, Pytest |
| **Security & Resilience** | `slowapi` (Rate Limiting), `tenacity` (Retries), `jose` (JWT) |
| **Frontend** | React 19, TypeScript, Vite, Axios (with Interceptors), CSS Modules |
| **AI / Data** | OpenAI API (Whisper), Google Gemini API, `yt-dlp`, BeautifulSoup4 |
| **DevOps** | GitHub Actions (CI), Uvicorn |

## 🚀 Local Development Setup

To run this project locally, you will need **Python 3.10+**, **Node.js 18+**, and **FFmpeg** installed on your machine.

### 1. Clone & Environment Setup

```bash
git clone [https://github.com/kaiwmr/smart-recipe-app.git](https://github.com/kaiwmr/smart-recipe-app.git)
cd smart-recipe-app
```

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies (including FFmpeg requirements)
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# ⚠️ EDIT .env: Add your API Keys, Secret Key, and DB string.
```

**Admin Bootstrapping (First Run):**
Since the app uses an invite-only system, you need to create the first admin user manually:
1. Temporarily set `is_admin = Column(Boolean, default=True)` in `backend/models.py`.
2. Start the server and register an account via the Frontend or Swagger UI.
3. Revert `default=True` back to `False` in `backend/models.py`.
4. Generate invite codes for other users via the protected `/docs` (Swagger UI) endpoint.

```bash
# Start the ASGI server
uvicorn main:app --reload
```
*API Documentation available at: `http://localhost:8000/docs` (Includes Cookie-based auth support)*

### 3. Frontend (React)

```bash
cd frontend
npm install

# Configure environment variables
cp .env.example .env

# Start the development server
npm run dev
```

*Frontend available at: `http://localhost:5173`*

## 🧪 Testing Pipeline

The backend features a comprehensive test suite using `pytest`. The testing environment leverages isolated test databases (`conftest.py`), overrides dependencies, and uses mocked external API responses to ensure reliable execution in CI environments without burning API quotas.

```bash
cd backend
pytest -v
```

*Automated tests run on every push via GitHub Actions.*

## 📈 Roadmap & Future Enhancements

- [ ] **Alembic Database Migrations:** Integrating Alembic for seamless schema upgrades without data loss.
- [ ] **Asynchronous Task Queues:** Implementing `Celery` + `Redis` to offload the heavy AI processing pipeline (Video scraping & Image generation) into background workers, preventing HTTP timeouts.
- [ ] **Containerization:** Adding `Dockerfile` and `docker-compose.yml` for unified, system-agnostic deployments.

---

**Developed by Kai Weismayr | [LinkedIn](https://www.linkedin.com/in/kai-weismayr-5610b234b/)**