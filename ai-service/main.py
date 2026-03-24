from fastapi import FastAPI, UploadFile, File
import PyPDF2
import spacy
from voice import analyze_voice
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
nlp = spacy.load("en_core_web_sm")

# ----------- RESUME PART -----------

def extract_text(file):
    pdf = PyPDF2.PdfReader(file.file)
    text = ""
    for page in pdf.pages:
        text += page.extract_text()
    return text


def extract_skills(text):
    skills = ["python", "java", "c++", "react", "node", "mongodb"]
    found = []

    for skill in skills:
        if skill.lower() in text.lower():
            found.append(skill)

    return found


def extract_experience(text):
    if "year" in text.lower():
        return "Experienced"
    elif "intern" in text.lower():
        return "Intern"
    else:
        return "Fresher"


def extract_education(text):
    degrees = ["b.tech", "mca", "b.e", "bsc", "msc"]

    for deg in degrees:
        if deg in text.lower():
            return deg.upper()

    return "Not Found"


def calculate_score(skills, experience):
    score = len(skills) * 10

    if experience == "Experienced":
        score += 20
    elif experience == "Intern":
        score += 10

    return score


# ----------- VOICE + FINAL API -----------

@app.post("/analyze-full")
async def analyze_full(
    resume: UploadFile = File(...),
    audio: UploadFile = File(...)
):
    # Resume analysis
    text = extract_text(resume)
    skills = extract_skills(text)
    experience = extract_experience(text)
    education = extract_education(text)

    resume_score = calculate_score(skills, experience)

    # Voice analysis
    voice_result = analyze_voice(audio)

    # Final score combine
    final_score = resume_score

    if "confidence" in voice_result:
        if voice_result["confidence"] == "High":
            final_score += 10
        elif voice_result["confidence"] == "Medium":
            final_score += 5

    # Final feedback (AI-like)
    if final_score < 50:
        final_feedback = "You need to improve both technical skills and communication. Add projects and practice speaking."
    elif final_score < 80:
        final_feedback = "You are a good candidate but improve confidence and add strong projects."
    else:
        final_feedback = "Excellent profile! You are interview ready."

    return {
        "resume": {
            "skills": skills,
            "experience": experience,
            "education": education,
            "score": resume_score
        },
        "voice": voice_result,
        "final_score": final_score,
        "final_feedback": final_feedback
    }