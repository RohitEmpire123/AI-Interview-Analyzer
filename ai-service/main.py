from fastapi import FastAPI, UploadFile, File
import PyPDF2
import spacy

app = FastAPI()
nlp = spacy.load("en_core_web_sm")

# Extract text from PDF
def extract_text(file):
    pdf = PyPDF2.PdfReader(file.file)
    text = ""
    for page in pdf.pages:
        text += page.extract_text()
    return text

# Skill extraction (basic)
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
def generate_feedback(score):
    if score < 30:
        return "Improve your skills and add projects"
    elif score < 60:
        return "Good resume but needs improvement"
    else:
        return "Strong resume, ready for interviews"
@app.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    text = extract_text(file)

    skills = extract_skills(text)
    experience = extract_experience(text)
    education = extract_education(text)

    score = calculate_score(skills, experience)
    feedback = generate_feedback(score)

    return {
        "skills": skills,
        "experience": experience,
        "education": education,
        "score": score,
        "feedback": feedback
    }