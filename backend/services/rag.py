from services.loader import load_pdf
from services.chunker import chunk_text
from services.vectorstore import create_and_save_index, load_index
from langchain_groq import ChatGroq


def process_pdf(file_path: str) -> bool:
    """Loads a PDF, chunks it, creates embeddings, and stores in Pinecone."""
    
    # 1. Load PDF
    pages = load_pdf(file_path)
    
    # 2. Chunk text
    chunks = chunk_text(pages)
    
    # 3. Create embeddings & store in Pinecone
    success = create_and_save_index(chunks)
    
    return success


def query_rag(question: str) -> str:
    """Retrieves relevant chunks from Pinecone and answers using LLM."""
    
    # 1. Load vector store (Pinecone now)
    vector_store = load_index()
    if not vector_store:
        return "Error: No documents processed. Upload a PDF first."
    
    # 2. Retrieve top chunks
    retriever = vector_store.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(question)
    
    if not docs:
        return "No relevant information found."
    
    # 3. Build context
    context = "\n\n".join([doc.page_content for doc in docs])
    
    # 4. LLM (Groq)
    llm = ChatGroq(
        model_name="llama-3.1-8b-instant",
        temperature=0
    )
    
    # 5. Prompt
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