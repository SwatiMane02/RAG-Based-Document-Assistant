from langchain_community.vectorstores import FAISS
from services.embedder import get_embeddings
from config import DB_DIR
import os

def create_and_save_index(chunks):
    """Creates a FAISS index from text chunks and saves it locally."""
    embedder = get_embeddings()
    vector_store = FAISS.from_documents(chunks, embedder)
    
    # Save the index to the db directory
    index_path = os.path.join(DB_DIR, "faiss_index")
    vector_store.save_local(index_path)
    return True

def load_index():
    """Loads the FAISS index from the local directory."""
    embedder = get_embeddings()
    index_path = os.path.join(DB_DIR, "faiss_index")
    
    if not os.path.exists(index_path):
        return None
        
    vector_store = FAISS.load_local(index_path, embedder, allow_dangerous_deserialization=True)
    return vector_store
