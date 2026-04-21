import { useRef, useState, useEffect } from "react";

export default function VideoRecorder({ setVideoFile, setAudioFile }) {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);
  const streamRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [preview, setPreview] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [timer, setTimer] = useState(0);

  // 🎥 Start camera on mount
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      alert("Please allow camera & microphone access");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
  };

  // ⏱️ Timer
  useEffect(() => {
    let interval;
    if (recording) {
      interval = setInterval(() => setTimer((p) => p + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [recording]);

  // 🎬 Countdown
  const startRecordingWithCountdown = () => {
    let count = 3;
    setCountdown(count);

    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        startRecording();
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const startRecording = () => {
    const stream = streamRef.current;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    chunks.current = [];
    setTimer(0);

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.current.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "video/webm" });

      const videoFile = new File([blob], "recorded.webm", {
        type: "video/webm",
      });

      setVideoFile(videoFile);

      const url = URL.createObjectURL(blob);
      setPreview(url);

      extractAudio(blob);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  // 🎧 Extract audio
  const extractAudio = async (videoBlob) => {
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = await videoBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const wavBlob = audioBufferToWav(audioBuffer);

      setAudioFile(new File([wavBlob], "audio.wav"));
    } catch (err) {
      console.log("Audio error", err);
    }
  };

  const audioBufferToWav = (buffer) => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const view = new DataView(new ArrayBuffer(length));

    let offset = 0;

    const write = (str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset++, str.charCodeAt(i));
      }
    };

    write("RIFF");
    view.setUint32(offset, length - 8, true); offset += 4;
    write("WAVEfmt ");
    view.setUint32(offset, 16, true); offset += 4;
    view.setUint16(offset, 1, true); offset += 2;
    view.setUint16(offset, numOfChan, true); offset += 2;
    view.setUint32(offset, buffer.sampleRate, true); offset += 4;
    view.setUint32(offset, buffer.sampleRate * numOfChan * 2, true); offset += 4;
    view.setUint16(offset, numOfChan * 2, true); offset += 2;
    view.setUint16(offset, 16, true); offset += 2;
    write("data");
    view.setUint32(offset, length - offset - 4, true);

    return new Blob([view], { type: "audio/wav" });
  };

const handleRetake = () => {
  if (preview) URL.revokeObjectURL(preview);

  setPreview(null);
  setVideoFile(null);
  setAudioFile(null);
  setTimer(0);

  setTimeout(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, 0);
};

  return (
    <div className="bg-gray-800 p-6 rounded mt-4 text-center">
      <h3 className="mb-4 text-lg font-semibold">Record Your Answer</h3>

      {countdown && (
        <div className="text-4xl text-yellow-400 mb-3">{countdown}</div>
      )}

      {recording && (
        <div className="text-green-400 mb-2">Recording: {timer}s</div>
      )}

      {/* 🎥 Camera / Preview */}
      <div className="flex justify-center">
        {!preview ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-[400px] h-[260px] object-cover rounded-lg border border-gray-700 shadow"
          />
        ) : (
          <video
            src={preview}
            controls
            className="w-[400px] h-[260px] object-cover rounded-lg border border-gray-700 shadow"
          />
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-3 mt-5">
        {!recording && !preview && (
          <button
            onClick={startRecordingWithCountdown}
            className="bg-green-500 px-5 py-2 rounded hover:bg-green-600"
          >
            Start
          </button>
        )}

        {recording && (
          <button
            onClick={stopRecording}
            className="bg-red-500 px-5 py-2 rounded hover:bg-red-600"
          >
            Stop
          </button>
        )}

        {preview && (
          <button
            onClick={handleRetake}
            className="bg-gray-500 px-5 py-2 rounded hover:bg-gray-600"
          >
            Retake
          </button>
        )}
      </div>
    </div>
  );
}