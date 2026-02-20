from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Die URL zur Datenbank definieren
SQLALCHEMY_DATABASE_URL = "sqlite:///./smartrecipe.db"

# 2. Die "Engine" (Der Motor) erstellen
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Die "Session" (Die Arbeitssitzung) vorbereiten
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Die "Base" (Die Basis-Klasse)
Base = declarative_base()

# 5. Dependency-Funktion für FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()