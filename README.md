# RAG-Based Document Assistant

![React](https://img.shields.io/badge/Frontend-React-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green)
![RAG](https://img.shields.io/badge/AI-RAG-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

An AI-powered document assistant that lets you upload PDFs and ask context-aware questions using Retrieval-Augmented Generation (RAG).

🔍 Built with a full-stack architecture combining FastAPI, React, and vector search (FAISS) for accurate, grounded answers.
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

## Features

- PDF upload with drag-and-drop
- Real-time chat with word-by-word streaming animation
- Chat session management with sidebar history
- Chat history persisted in SQLite (backend) and localStorage (frontend)
- Markdown rendering in AI responses
- Source snippet references
- Export chat as text file


## Project Structure

```
## 📁 Project Structure
frontend/
└── src/
├── components/ # UI (Chat, Sidebar, etc.)
├── pages/
└── services/ # API calls

backend/
├── routes/ # API endpoints
├── services/ # RAG pipeline
├── models/ # DB models
└── main.py # FastAPI entry
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

All RAG steps (load, chunk, embed, store, retrieve) run locally.  
The API key is only needed for **answer generation**, using Groq’s fast Llama 3.1 model.  
It offers a free tier and can be easily swapped with other providers like OpenAI.

## Why Hugging Face?

The embedding model runs entirely locally using `sentence-transformers`.  
It converts text into vectors for FAISS search, with no API key required after initial download.


<h2 align="center">🖼️ Application Preview</h2>

<p align="center">
  <img src="https://github.com/user-attachments/assets/9d7421cc-4b02-4da1-a6e1-3e6d99ebcede" width="900"/>
  <br/>
  <em>📄 Upload Document Interface</em>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/de9fbb9f-20d0-4241-b0fb-8223d71c812f" width="900"/>
  <br/>
  <em>💬 Chat Interface with AI Responses</em>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/f3d113f1-84bd-4a7c-96ba-308e3bcd099b" width="900"/>
  <br/>
  <em>⚡ RAG-powered Answer Generation</em>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/a851180b-87bc-48f3-a247-2686f2301945" width="900"/>
  <br/>
  <em>📚 Chat History Sidebar</em>
</p>

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
