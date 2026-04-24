from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from services.rag import query_rag
from database import get_db
import crud

router = APIRouter()


class QueryRequest(BaseModel):
    question: str
    chat_id: Optional[str] = None   # If not provided, a new session is created


@router.post("/query")
async def ask_question(request: QueryRequest, db: Session = Depends(get_db)):
    """Accepts a JSON payload with a question and returns an RAG-generated answer.
    Saves both the user question and AI response to the chat history."""
    if not request.question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    # Use provided chat_id or auto-generate one
    chat_id = request.chat_id or crud.generate_chat_id()

    try:
        # 1. Save user message
        crud.save_message(db, chat_id=chat_id, role="user", content=request.question)

        # 2. Run RAG pipeline
        answer = query_rag(request.question)

        # 3. Save AI response
        crud.save_message(db, chat_id=chat_id, role="ai", content=answer)

        # 4. Return answer with chat_id so the frontend can continue the session
        return {"answer": answer, "chat_id": chat_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
