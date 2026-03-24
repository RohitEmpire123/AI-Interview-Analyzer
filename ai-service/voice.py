import speech_recognition as sr

def analyze_voice(file):
    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(file.file) as source:
            audio = recognizer.record(source)

        text = recognizer.recognize_google(audio)

        if not text:
            return {"error": "No speech detected"}

        words = text.split()
        word_count = len(words)

        # Speed logic
        if word_count > 15:
            speed = "Fast"
        elif word_count > 8:
            speed = "Normal"
        else:
            speed = "Slow"

        # Confidence logic (FIXED)
        if word_count >= 18:
            confidence = "High"
        elif word_count >= 10:
            confidence = "Medium"
        else:
            confidence = "Low"

        # Fluency detection
        fillers = ["um", "uh", "like", "you know"]
        filler_count = sum(1 for word in words if word.lower() in fillers)

        fluency = "Good"
        if filler_count > 2:
            fluency = "Needs Improvement"

        # Feedback
        if confidence == "Low":
            feedback = "Try to speak more and improve confidence"
        elif confidence == "Medium":
            feedback = "Good, but you can improve fluency"
        else:
            feedback = "Excellent communication skills"

        return {
            "text": text,
            "word_count": word_count,
            "speed": speed,
            "confidence": confidence,
            "fluency": fluency,
            "feedback": feedback
        }

    except sr.UnknownValueError:
        return {"error": "Audio not clear, try speaking clearly"}

    except Exception as e:
        return {"error": str(e)}