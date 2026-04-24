"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ChatCreate(BaseModel):
    """Schema for creating a new chat message."""
    chat_id: Optional[str] = None   # Auto-generated if not provided
    role: str                       # "user" or "ai"
    content: str


class ChatResponse(BaseModel):
    """Schema for returning a chat message."""
    id: int
    chat_id: str
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True      # Enables ORM mode (read from SQLAlchemy objects)
