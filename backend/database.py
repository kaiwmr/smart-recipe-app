from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Die URL zur Datenbank definieren
# 'sqlite:///' bedeutet: Wir nutzen SQLite
# './smartrecipe.db' bedeutet: Die Datei liegt im aktuellen Ordner
SQLALCHEMY_DATABASE_URL = "sqlite:///./smartrecipe.db"

# 2. Die "Engine" (Der Motor) erstellen
# connect_args={"check_same_thread": False} ist nur für SQLite nötig
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Die "Session" (Die Arbeitssitzung) vorbereiten
# Jedes Mal, wenn wir etwas in der DB machen, erstellen wir eine Instanz hiervon
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Die "Base" (Die Basis-Klasse)
# Von dieser Klasse werden später alle unsere Modelle (User, Rezepte) erben.
Base = declarative_base()