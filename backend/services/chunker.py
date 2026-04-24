from langchain_text_splitters import RecursiveCharacterTextSplitter

def chunk_text(pages):
    """Splits loaded PDF pages into smaller chunks."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )
    chunks = text_splitter.split_documents(pages)
    return chunks
