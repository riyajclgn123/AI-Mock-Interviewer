from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import fitz  # PyMuPDF
import os
import uuid
import json
import torch

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'resumes'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Load Phi-2 model ---
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

# --- Upload Resume ---
@app.route("/upload-resume", methods=["POST"])
def upload_resume():
    file = request.files.get("file")
    if file is None:
        return jsonify({"error": "No file uploaded"}), 400
    try:
        text = extract_text_from_pdf(file)
        return jsonify({"resumeText": text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- Generate Questions ---
@app.route("/generate-questions", methods=["POST"])
def generate_questions():
    data = request.get_json()
    resume = data.get("resumeText", "").strip()
    if not resume:
        return jsonify({"error": "Resume text is missing"}), 400

    prompt = (
        f"Below is a resume:\n{resume}\n\n"
        "Based on the resume, generate:\n"
        "- 5 technical interview questions\n"
        "- 3 behavioral interview questions\n\n"
        "Questions:"
    )

    output = pipe(prompt, max_new_tokens=300, temperature=0.7, do_sample=True)[0]["generated_text"]
    result = output.replace(prompt, "").strip()
    questions = [line.strip("0123456789.:- ") for line in result.split("\n") if line.strip()]

    return jsonify({"questions": questions[:8]})

# --- Save Response ---
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

if __name__ == "__main__":
    app.run(port=5000, debug=False)
