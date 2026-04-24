"""
SQLAlchemy database engine, session factory, and declarative base.
Uses SQLite stored in a dedicated chat_data/ directory to avoid
macOS extended-attribute permission issues on the project root.
"""

import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ── Absolute path to the database ────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent
DB_DIR = BASE_DIR / "chat_data"
DB_PATH = DB_DIR / "chat.db"

# Ensure the directory exists and is writable
os.makedirs(DB_DIR, mode=0o755, exist_ok=True)

SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # Required for SQLite + FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a DB session and closes it after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
