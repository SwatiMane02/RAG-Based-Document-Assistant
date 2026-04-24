# RAG-Based Document Assistant

A full-stack AI-powered document assistant that lets you upload PDFs and ask questions about their content using Retrieval-Augmented Generation (RAG).

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Axios
- Framer Motion

### Backend
- FastAPI
- LangChain + Groq (Llama 3.1 8B)
- FAISS (vector store)
- Sentence Transformers (embeddings)
- SQLAlchemy + SQLite (chat history)

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Sidebar, ChatWindow, InputBar, etc.)
│   │   ├── pages/           # Route pages (Index, NotFound)
│   │   ├── services/        # API client (Axios)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript interfaces
│   │   └── lib/             # Utility functions
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── services/
│   │   ├── rag.py           # RAG pipeline (process PDF + query)
│   │   ├── loader.py        # PDF text extraction
│   │   ├── chunker.py       # Text chunking
│   │   ├── embedder.py      # Embedding generation
│   │   └── vectorstore.py   # FAISS index management
│   ├── routes/
│   │   ├── upload.py        # POST /upload
│   │   └── query.py         # POST /query
│   ├── main.py              # FastAPI app + CORS + GET /history
│   ├── database.py          # SQLAlchemy engine + session
│   ├── models.py            # ChatMessage ORM model
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── crud.py              # DB operations
│   ├── config.py            # Environment config
│   └── requirements.txt
│
└── .gitignore
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload` | Upload a PDF file (multipart/form-data) |
| `POST` | `/query` | Ask a question (`{ question, chat_id? }`) |
| `GET` | `/history/{chat_id}` | Retrieve chat session messages |
| `GET` | `/` | Health check |

## RAG Pipeline

1. **Load** — Extract text from uploaded PDF using PyPDF
2. **Chunk** — Split text into smaller overlapping segments
3. **Embed** — Generate vector embeddings using Sentence Transformers
4. **Store** — Save embeddings in a FAISS index
5. **Retrieve** — On query, find top-3 relevant chunks via similarity search
6. **Generate** — Send context + question to Groq Llama 3.1 for answer

## Why Groq API Key?

Steps 1–5 of the pipeline (load, chunk, embed, store, retrieve) all run **locally** — no API key needed. The API key is only required for **step 6 (answer generation)**, which uses Groq's hosted **Llama 3.1 8B** model to generate natural-language answers from the retrieved document chunks. Groq provides free-tier access with fast inference, so the app works without expensive GPU hardware. The LLM is swappable — you can replace `ChatGroq` with `ChatOpenAI` or any other LangChain-compatible provider by editing `services/rag.py`.

## Why Hugging Face?

The embedding model `sentence-transformers/all-MiniLM-L6-v2` is downloaded from Hugging Face and runs **entirely locally** using the `sentence-transformers` library. It converts text chunks into 384-dimensional vectors that FAISS uses for similarity search. No Hugging Face API key is needed — the model is downloaded once and cached on your machine.

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm
- Groq API key ([console.groq.com](https://console.groq.com))

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file:

```
GROQ_API_KEY=your_groq_api_key_here
```

Start the server:

```bash
uvicorn main:app --reload
```

Backend runs at `http://127.0.0.1:8000`. API docs at `/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:8080`.

## Features

- PDF upload with drag-and-drop
- Real-time chat with word-by-word streaming animation
- Chat session management with sidebar history
- Chat history persisted in SQLite (backend) and localStorage (frontend)
- Markdown rendering in AI responses
- Source snippet references
- Export chat as text file
- Dark theme UI