from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from routes import upload, query
from database import engine, get_db
from models import Base
import crud
from schemas import ChatResponse

# Create all tables (safe to call repeatedly — no-ops if tables exist)
Base.metadata.create_all(bind=engine)

# Initialize FastAPI
app = FastAPI(
    title="RAG Based Document Assistant",
    description="A backend for uploading PDFs and asking questions using RAG.",
    version="1.0.0"
)

# Enable CORS so the React frontend can reach this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(upload.router, tags=["Upload"])
app.include_router(query.router, tags=["Query"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the RAG Based Document Assistant API. Visit /docs to use the API."}


@app.get("/history/{chat_id}", response_model=list[ChatResponse], tags=["Chat History"])
def get_history(chat_id: str, db: Session = Depends(get_db)):
    """Return all messages for a chat session, ordered by timestamp."""
    return crud.get_chat_history(db, chat_id)
