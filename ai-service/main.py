from fastapi import FastAPI, UploadFile, File
import PyPDF2
import spacy
from voice import analyze_voice
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from groq import Groq
from face import analyze_face
import mediapipe as mp

mp_face = mp.solutions.face_mesh
# ---------------- ENV ----------------
load_dotenv()

# ---------------- GROQ SETUP ----------------
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ---------------- APP ----------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp = spacy.load("en_core_web_sm")

# ---------------- AI FUNCTIONS ----------------

def ai_resume_analysis(text):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{
                "role": "user",
                "content": f"""
Analyze this resume and give:
- Skills
- Experience level
- Strengths
- Weaknesses
- Score out of 100
- Final feedback

Resume:
{text}
"""
            }]
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"AI error: {str(e)}"


def ai_voice_feedback(text):
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{
                "role": "user",
                "content": f"""
Analyze this interview answer:

{text}

Give:
- Confidence level
- Communication quality
- Improvement suggestions
"""
            }]
        )
        return response.choices[0].message.content

    except Exception as e:
        return f"AI error: {str(e)}"


# ---------------- RESUME FUNCTIONS ----------------

def extract_text(file):
    pdf = PyPDF2.PdfReader(file.file)
    text = ""
    for page in pdf.pages:
        text += page.extract_text() or ""
    return text


def extract_skills(text):
    skills = ["python", "java", "c++", "react", "node", "mongodb"]
    return [skill for skill in skills if skill.lower() in text.lower()]


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


# ---------------- MAIN API ----------------

@app.post("/analyze-full")
async def analyze_full(
    resume: UploadFile = File(...),
    audio: UploadFile = File(...),
    video: UploadFile = File(None)
):
    # 🔹 Resume text
    text = extract_text(resume)

    # 🔹 AI Resume
    ai_resume = ai_resume_analysis(text) if text.strip() else "No resume content"

    # 🔹 Basic Resume
    skills = extract_skills(text)
    experience = extract_experience(text)
    education = extract_education(text)
    resume_score = calculate_score(skills, experience)

    # 🔹 Voice Analysis
    voice_result = analyze_voice(audio)

    # 🔹 AI Voice
    voice_text = voice_result.get("text", "")
    ai_voice = ai_voice_feedback(voice_text) if voice_text else "No speech detected"

    # 🔹 Face Analysis (SAFE)
    face_result = {}

    if video and video.filename:
        temp_path = "temp_video.mp4"

        with open(temp_path, "wb") as f:
            f.write(await video.read())

        face_result = analyze_face(temp_path)

        # 🔥 DELETE FILE AFTER USE
        os.remove(temp_path)

    # 🔹 Return (NO FINAL SCORE HERE → Node handles it)
    return {
        "resume": {
            "skills": skills,
            "experience": experience,
            "education": education,
            "score": resume_score
        },
        "voice": voice_result,
        "face": face_result,
        "ai_resume_analysis": ai_resume,
        "ai_voice_analysis": ai_voice
    }