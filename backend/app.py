from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import fitz  # PyMuPDF
import os
import uuid
import json
import torch
import re

# --- Keywords ---
TECHNICAL_KEYWORDS = [
    "python", "java", "c++", "html", "css", "javascript", "react", "node", "typescript",
    "sql", "mysql", "mongodb", "tensorflow", "pytorch", "linux", "git",
    "docker", "kubernetes", "aws", "azure", "gcp", "flask", "django", "rest api",
    "spring", "firebase", "nlp", "machine learning", "deep learning", "data science", "bash"
]

MAJOR_KEYWORDS = [
    "computer science", "software engineering", "information technology",
    "electrical engineering", "cybersecurity", "data science", "artificial intelligence", "information systems"
]

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'resumes'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Load Phi-2 Model ---
model_id = "microsoft/phi-2"
device = "cuda" if torch.cuda.is_available() else "cpu"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float32)
model.to(device)

pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, device=0 if device == "cuda" else -1)

# --- PDF Text Extraction ---
def extract_text_from_pdf(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    return "\n".join([page.get_text() for page in doc])

# --- Resume Quality Check ---
def is_resume_good(resume_text):
    lower_text = resume_text.lower()
    if len(lower_text.split()) < 20:
        return False

    tech_terms = [word for word in TECHNICAL_KEYWORDS if word in lower_text]
    has_major = any(major in lower_text for major in MAJOR_KEYWORDS)

    return len(tech_terms) >= 4 and has_major  # Relaxed condition

# --- Extract Only Clean Questions ---
def extract_questions(text):
    lines = text.strip().split("\n")
    questions = []

    for line in lines:
        line = line.strip()

        if not line:
            continue

        # Remove things like "1. ", "Question 1: ", etc.
        line = re.sub(r"^(question\s*)?\d+[.)\s:-]*", "", line, flags=re.IGNORECASE).strip()

        # Accept if it ends with ? or has enough words
        if line.endswith("?") or len(line.split()) >= 5:
            questions.append(line)

    return questions

# --- Process Resume and Generate Questions ---
@app.route("/process-resume", methods=["POST"])
def process_resume():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        resume_text = extract_text_from_pdf(file)
    except Exception as e:
        return jsonify({"error": f"Failed to extract text: {str(e)}"}), 500

    if not is_resume_good(resume_text):
        return jsonify({
            "error": "The provided resume lacks sufficient technical depth or a declared field of study. "
                     "Please revise and upload a more detailed resume."
        }), 200

    # --- Best Prompt for AI Mock Interviewer ---
    prompt = (
        f"Resume:\n\n{resume_text}\n\n"
        "Generate exactly 6 technical and 4 behavioral interview questions based ONLY on the content of this resume. "
        "Ask questions related to the user's projects, technical skills, major, tools, or internship experience. "
        "Avoid any instructions or commentary. Only return clean, direct questions—one per line."
    )

    try:
        output = pipe(prompt, max_new_tokens=700, temperature=0.7, do_sample=True)[0]["generated_text"]
    except Exception as e:
        return jsonify({"error": f"Model generation failed: {str(e)}"}), 500

    # Clean output
    result = output.replace(prompt, "").strip()
    questions = extract_questions(result) or []  # Prevent NoneType crash

    if len(questions) < 6:
        return jsonify({"error": "The AI could not generate enough meaningful questions. "
                                 "Please ensure your resume includes technical details, skills, and your field of study."}), 200

    return jsonify({"questions": questions[:10]})  # 6 tech + 4 behavioral

# --- Save Interview Response ---
@app.route("/submit-response", methods=["POST"])
def submit_response():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing response data"}), 400

    os.makedirs("responses", exist_ok=True)
    file_path = os.path.join("responses", f"{uuid.uuid4()}.json")
    with open(file_path, "w") as f:
        json.dump(data, f, indent=2)

    return jsonify({"status": "saved", "filename": os.path.basename(file_path)})

# --- Run Server ---
if __name__ == "__main__":
    app.run(port=5000, debug=False)
