from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, questions

app = FastAPI()

# Enable CORS for your frontend URL (no trailing slash)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with separate prefixes for clarity
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(questions.router, prefix="/api/questions", tags=["Questions"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Mock Interviewer API"}
