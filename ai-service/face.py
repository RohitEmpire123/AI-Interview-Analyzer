import cv2
import mediapipe as mp

mp_face = mp.solutions.face_mesh
face_mesh = mp_face.FaceMesh()

def analyze_face(video_path):
    cap = cv2.VideoCapture(video_path)

    face_detected = 0
    frames = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frames += 1

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = face_mesh.process(rgb)

        if result.multi_face_landmarks:
            face_detected += 1

    cap.release()

    if frames == 0:
        return {
            "confidence": "Low",
            "note": "No video detected"
        }

    detection_ratio = face_detected / frames

    # 🔥 SIMPLE LOGIC
    if detection_ratio > 0.7:
        confidence = "High"
    elif detection_ratio > 0.4:
        confidence = "Medium"
    else:
        confidence = "Low"

    return {
        "confidence": confidence,
        "face_detection_ratio": round(detection_ratio, 2)
    }