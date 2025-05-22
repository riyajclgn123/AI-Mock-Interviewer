from fastapi import APIRouter, UploadFile, File
import shutil
import os

router = APIRouter()
UPLOAD_FOLDER = "uploads"

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files are allowed"}

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Return the saved file path so frontend can refer to it later
    return {"message": "Upload successful", "file_path": file_path}
