from langchain_community.document_loaders import PyPDFLoader
import os

def load_pdf(file_path: str):
    """Loads a PDF file and returns its pages."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    loader = PyPDFLoader(file_path)
    pages = loader.load()
    return pages
