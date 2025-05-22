from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import fitz  # PyMuPDF
import os
import uuid
import json
import torch
import re

app = Flask(__name__)
CORS(app, origins=["http://localhost:3001"], supports_credentials=True)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interviewer.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

UPLOAD_FOLDER = 'resumes'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- Keywords ---
TECHNICAL_KEYWORDS = ["python", "java", "c++", "html", "css", "javascript", "react", "node", "typescript", "sql", "mysql", "mongodb", "tensorflow", "pytorch", "linux", "git", "docker", "kubernetes", "aws", "azure", "gcp", "flask", "django", "rest api", "spring", "firebase", "nlp", "machine learning", "deep learning", "data science", "bash"]
MAJOR_KEYWORDS = ["computer science", "software engineering", "information technology", "electrical engineering", "cybersecurity", "data science", "artificial intelligence", "information systems"]

# --- AI Model ---
model_id = "microsoft/phi-2"
device = "cuda" if torch.cuda.is_available() else "cpu"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float32)
model.to(device)
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, device=0 if device == "cuda" else -1)

# --- Database Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    responses = db.relationship('Response', backref='user', lazy=True)

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    questions = db.Column(db.Text)
    answers = db.Column(db.Text)

# --- Utils ---
def extract_text_from_pdf(file):
    doc = fitz.open(stream=file.read(), filetype="pdf")
    return "\n".join([page.get_text() for page in doc])

def is_resume_good(resume_text):
    lower_text = resume_text.lower()
    if len(lower_text.split()) < 20:
        return False
    tech_terms = [word for word in TECHNICAL_KEYWORDS if word in lower_text]
    has_major = any(major in lower_text for major in MAJOR_KEYWORDS)
    return len(tech_terms) >= 4 and has_major

def extract_questions(text):
    lines = text.strip().split("\n")
    questions = []
    for line in lines:
        line = re.sub(r"^(question\s*)?\d+[.)\s:-]*", "", line.strip(), flags=re.IGNORECASE)
        if line.endswith("?") or len(line.split()) >= 5:
            questions.append(line)
    return questions

# --- Auth Routes ---
@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    first_name = data.get("firstName")
    last_name = data.get("lastName")

    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already exists"}), 400

    hashed_password = generate_password_hash(password)
    user = User(username=username, password_hash=hashed_password, first_name=first_name, last_name=last_name)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Signup successful"}), 200

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401
    return jsonify({
        "userId": user.id,
        "username": user.username,
        "firstName": user.first_name,
        "lastName": user.last_name
    })

# --- Resume Processing ---
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
        return jsonify({"error": "Resume lacks technical depth or field of study"}), 200

    prompt = (
        f"Resume:\n\n{resume_text}\n\n"
        "Generate exactly 6 technical and 4 behavioral interview questions based ONLY on the content of this resume. "
        "Only return clean, direct questions—one per line."
    )

    try:
        output = pipe(prompt, max_new_tokens=700, temperature=0.7, do_sample=True)[0]["generated_text"]
    except Exception as e:
        return jsonify({"error": f"Model generation failed: {str(e)}"}), 500

    result = output.replace(prompt, "").strip()
    questions = extract_questions(result) or []
    if len(questions) < 6:
        return jsonify({"error": "AI could not generate enough questions"}), 200

    return jsonify({"questions": questions[:10]})

# --- Save Answers ---
@app.route("/submit-response", methods=["POST"])
def submit_response():
    data = request.get_json()
    user_id = data.get("userId")
    questions = data.get("questions")
    answers = data.get("answers")

    if not all([user_id, questions, answers]):
        return jsonify({"error": "Missing data"}), 400

    response = Response(user_id=user_id, questions=json.dumps(questions), answers=json.dumps(answers))
    db.session.add(response)
    db.session.commit()

    return jsonify({"status": "saved"})

# --- Get History ---
@app.route("/history/<int:user_id>", methods=["GET"])
def get_history(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    history = [
        {
            "questions": json.loads(resp.questions),
            "answers": json.loads(resp.answers)
        }
        for resp in user.responses
    ]
    return jsonify({"history": history})

# --- Run ---
if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        # ✅ Manually seed admin user
        if not User.query.filter_by(username="admin").first():
            admin = User(
                username="admin",
                password_hash=generate_password_hash("adminpass"),
                first_name="Admin",
                last_name="User"
            )
            db.session.add(admin)
            db.session.commit()
            print("✅ Admin user seeded: admin / adminpass")

    app.run(port=5000, debug=True)
