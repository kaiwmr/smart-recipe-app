from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# 1. URL zur Datenbank definieren
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# 2. Engine erstellen
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Session vorbereiten
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Base
Base = declarative_base()

# 5. Dependency-Funktion für FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()