from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Get the key from environment
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_questions(resume_text: str):
    prompt = f"Generate interview questions based on this resume: {resume_text}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
