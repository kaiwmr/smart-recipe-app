from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SECRET_KEY: str = "secret_key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_SECONDS: int = 300

    DATABASE_URL: str = "sqlite:///./test.db"
    GEMINI_API_KEY: str
    OPENAI_API_KEY: str

    FRONTEND_URLS: list[str] = ["http://localhost:5173"]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    

settings = Settings()