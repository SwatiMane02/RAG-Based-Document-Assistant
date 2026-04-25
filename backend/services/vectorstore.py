from langchain_pinecone import PineconeVectorStore
from services.embedder import get_embeddings
from pinecone import Pinecone
from config import PINECONE_API_KEY, PINECONE_INDEX_NAME

# Initialize Pinecone
pc = Pinecone(api_key=PINECONE_API_KEY)

# Create and store vectors in Pinecone
def create_and_save_index(chunks):
    """Creates embeddings from chunks and stores them in Pinecone."""
    embedder = get_embeddings()

    PineconeVectorStore.from_documents(
        documents=chunks,
        embedding=embedder,
        index_name=PINECONE_INDEX_NAME
    )

    return True


# Load vector store from Pinecone
def load_index():
    """Loads the Pinecone vector store."""
    embedder = get_embeddings()

    try:
        vector_store = PineconeVectorStore(
            index_name=PINECONE_INDEX_NAME,
            embedding=embedder
        )
        return vector_store
    except Exception as e:
        print("Error loading Pinecone index:", e)
        return None