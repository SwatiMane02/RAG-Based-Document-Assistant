from dotenv import load_dotenv
import os

# Load variables from .env file FIRST
load_dotenv()

# Set your Groq API Key here or in environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")

# Application paths
DATA_DIR = "data"
DB_DIR = "db"

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(DB_DIR, exist_ok=True)
