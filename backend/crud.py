"""
CRUD operations for chat history.
"""

import uuid
from sqlalchemy.orm import Session
from models import ChatMessage


def save_message(db: Session, chat_id: str, role: str, content: str) -> ChatMessage:
    """Save a single chat message to the database."""
    message = ChatMessage(
        chat_id=chat_id,
        role=role,
        content=content,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_chat_history(db: Session, chat_id: str) -> list[ChatMessage]:
    """Retrieve all messages for a chat session, ordered by timestamp."""
    return (
        db.query(ChatMessage)
        .filter(ChatMessage.chat_id == chat_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )


def generate_chat_id() -> str:
    """Generate a new unique chat session ID."""
    return str(uuid.uuid4())
