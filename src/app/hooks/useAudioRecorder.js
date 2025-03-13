import { useState, useRef } from "react";

export function useAudioRecorder(sendAudio) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                echoCancellation: true,
                autoGainControl: true,
                noiseSuppression: true,
            },
        });
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);

        mediaRecorder.ondataavailable = async (event) => {
            const base64Data = await blobToBase64(event.data);
            sendAudio(base64Data);
        };

        // Start recording
        mediaRecorder.start();
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    return { isRecording, startRecording, stopRecording };
}

// Helper to convert blob to base64
async function blobToBase64(blob) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
    });
}