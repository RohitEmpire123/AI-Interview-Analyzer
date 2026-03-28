# 🚀 AI Interview Analyzer

An AI-powered full-stack application that analyzes a candidate’s resume, voice response, and facial expressions to generate an overall interview readiness score.

---

## 🎯 Features

- 📄 Resume Analysis (NLP-based)
- 🎤 Voice Analysis (confidence, fluency, speed)
- 🎥 Facial Expression Analysis (confidence detection)
- 🤖 AI Feedback (resume + voice)
- 📊 Smart Scoring System
- 📈 Analytics (progress, summary, top skills)
- 🎯 Job Role Matching
- 📄 PDF Report Download
- 🔐 Authentication (JWT)

---

## 🏗️ Tech Stack

### Frontend
- React (Vite)

### Backend
- Node.js
- Express.js
- MongoDB

### AI Microservice
- FastAPI (Python)
- spaCy (NLP)
- MediaPipe (Computer Vision)
- Speech Processing
- Groq API (LLM)

---

## 🧠 Architecture


Frontend (React)
↓
Node.js (Backend)
↓
FastAPI (AI Service)
↓
MongoDB


---

## ⚙️ Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/RohitEmpire123/AI-Interview-Analyzer.git
cd AI-Interview-Analyzer
```
### 2️⃣ Backend Setup (Node)
```bash
cd backend
npm install
npm run dev
```

### 3️⃣ AI Service (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4️⃣ Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```
### AI Service (.env)
```
GROQ_API_KEY=your_groq_api_key
```
## 📡 API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Analysis
- POST /api/analyze

### Reports
- GET /api/reports
- GET /api/reports/:id
- DELETE /api/reports/:id

### Analytics
- GET /api/reports/stats/summary
- GET /api/reports/stats/progress
- GET /api/reports/stats/top-skills

### Job Matching
- POST /api/reports/match/:id
### PDF Download
- GET /api/reports/download/:id

## 📊 Scoring Logic
Final Score = 40% Resume + 30% Voice + 30% Face
## 🎯 Use Case

This system simulates a real interview screening process by evaluating:

Technical profile (resume)
Communication skills (voice)
Confidence level (face)
## 👨‍💻 Author

Rohit Sharma

## 🚀 Future Improvements
- Better UI (in progress)
- Real-time video analysis
- AI mock interview system

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!