import pytest
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from database import Base, get_db
from main import app
from httpx import AsyncClient, ASGITransport

# 1. Test Datenbank im RAM (wird bei jedem Testlauf neu erstellt)
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

@pytest.fixture(scope="function")
def db_session():
    # Tabellen vor dem Test erstellen
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        # Nach dem Test alles löschen, damit der nächste Test sauber startet
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
async def client(db_session):
    
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    # Überschreiben der echten DB-Verbindung der App mit der Test-DB
    app.dependency_overrides[get_db] = override_get_db

    # ASGITransport erlaubt es, die App direkt ohne echten Server zu testen
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac