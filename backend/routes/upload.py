from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
from services.rag import process_pdf
from config import DATA_DIR

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Uploads a PDF, saves it to /data, and triggers RAG processing."""
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        # Save file in /data
        file_path = os.path.join(DATA_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Call process_pdf()
        success = process_pdf(file_path)
        
        if success:
            return {"message": f"Successfully processed {file.filename}. Ready for queries!"}
        else:
            raise HTTPException(status_code=500, detail="Failed to process document.")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
