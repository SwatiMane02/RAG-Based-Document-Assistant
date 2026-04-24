"""
SQLAlchemy ORM models for the chat history feature.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from database import Base


class ChatMessage(Base):
    """Stores individual chat messages, grouped by chat_id (session)."""

    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    chat_id = Column(String, index=True, nullable=False)
    role = Column(String, nullable=False)       # "user" or "ai"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<ChatMessage(id={self.id}, chat_id='{self.chat_id}', role='{self.role}')>"
