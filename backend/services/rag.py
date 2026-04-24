from services.loader import load_pdf
from services.chunker import chunk_text
from services.vectorstore import create_and_save_index, load_index
from langchain_groq import ChatGroq

def process_pdf(file_path: str) -> bool:
    """Loads a PDF, chunks it, creates embeddings, and stores in FAISS."""
    # 1. Load PDF
    pages = load_pdf(file_path)
    
    # 2. Chunk text
    chunks = chunk_text(pages)
    
    # 3. Create embeddings & 4. Store in FAISS
    success = create_and_save_index(chunks)
    
    return success

def query_rag(question: str) -> str:
    """Loads FAISS, retrieves chunks, and answers the question using LLM."""
    
    # 1. Load FAISS vector store
    vector_store = load_index()
    if not vector_store:
        return "Error: No documents processed. Upload a PDF first."
    
    # 2. Retrieve top chunks
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(question)
    
    # 3. Build context manually
    context = "\n\n".join([doc.page_content for doc in docs])
    
    # 4. LLM
    llm = ChatGroq(
    model_name="llama-3.1-8b-instant",
    temperature=0
    )
    
    # 5. Prompt (manual)
    prompt = f"""
    You are an AI assistant.

    Use the context below to answer the question.
    If the answer is not in the context, say "I don't know".

    Context:
    {context}

    Question:
    {question}

    Answer:
    """
    
    # 6. Generate response
    response = llm.invoke(prompt)
    
    return response.content
