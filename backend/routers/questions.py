from fastapi import APIRouter, Query
from services.pdf_service import extract_text_from_pdf
from services.ai_service import generate_questions

router = APIRouter()

@router.get("/generate-questions")
async def get_questions(file_path: str = Query(..., description="Path to uploaded resume PDF")):
    # Extract text from PDF file on server
    resume_text = extract_text_from_pdf(file_path)
    # Generate AI interview questions based on text
    questions = generate_questions(resume_text)
    return {"questions": questions}
