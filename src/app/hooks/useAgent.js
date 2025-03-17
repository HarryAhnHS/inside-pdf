import { useState, useRef } from "react";

const PLAYAI_WS_URL = "wss://api.play.ai/v1/talk/";
const agentId = process.env.NEXT_PUBLIC_PLAYAI_AGENT_ID;
const apiKey = process.env.NEXT_PUBLIC_PLAYAI_AGENT_API_KEY;

export function useAgent(textData) {
    const [isRecording, setIsRecording] = useState(false);
    const [agentState, setAgentState] = useState("idle"); // "idle" | "thinking" | "speaking"
    const [currentMessage, setCurrentMessage] = useState("");
    const wsRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioStreamRef = useRef(null);
    const audioBuffersRef = useRef([]);
    const audioElementRef = useRef(null);
    const mediaSourceRef = useRef(null);
    const sourceBufferRef = useRef(null);

    const initializeMediaSource = () => {
        if (!audioElementRef.current) {
            audioElementRef.current = new Audio();
            audioElementRef.current.autoplay = true;
        }

        if (!mediaSourceRef.current) {
            mediaSourceRef.current = new MediaSource();
            audioElementRef.current.src = URL.createObjectURL(mediaSourceRef.current);

            mediaSourceRef.current.addEventListener('sourceopen', () => {
                if (!sourceBufferRef.current) {
                    sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer('audio/mpeg');
                    sourceBufferRef.current.mode = 'sequence';
                    
                    sourceBufferRef.current.addEventListener('updateend', () => {
                        if (audioBuffersRef.current.length > 0 && !sourceBufferRef.current.updating) {
                            const nextBuffer = audioBuffersRef.current.shift();
                            sourceBufferRef.current.appendBuffer(nextBuffer);
                        }
                    });
                }
            });
        }
    };

    const startRecording = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            console.error("MediaDevices API not supported.");
            return;
        }

        setCurrentMessage("");
        setAgentState("idle");
        console.log("Starting recording...");

        try {
            initializeMediaSource();

            console.log("Connecting WebSocket to:", `${PLAYAI_WS_URL}${agentId}`);
            const ws = new WebSocket(`${PLAYAI_WS_URL}${agentId}`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connected! Sending setup...");
                ws.send(
                    JSON.stringify({
                        type: "setup",
                        apiKey,
                        outputFormat: "mp3",
                        outputSampleRate: 24000,
                        prompt: `The current text on the page is: ${textData}. Answer questions about this text.`,
                    })
                );
                setIsRecording(true);
                startMediaRecorder();
            };

            ws.onmessage = async (message) => {
                try {
                    const event = JSON.parse(message.data);
                    console.log("Event:", event);
                    
                    if (event.type === "voiceActivityStart") {
                        console.log("User started speaking!");
                        setAgentState("thinking");
                    }
            
                    if (event.type === "voiceActivityEnd") {
                        console.log("User stopped speaking!");
                        // Keep agent in thinking state until audio starts
                    }

                    if (event.type === "audioStreamStart") {
                        console.log("Agent started speaking!");
                        setAgentState("speaking");
                    }

                    if (event.type === "audioStreamEnd") {
                        console.log("Agent finished speaking!");
                        setAgentState("idle");
                        setCurrentMessage(event.message || "");
                        if (event.message?.toLowerCase().includes("goodbye") || 
                            event.message?.toLowerCase().includes("end the call")) {
                            stopRecording();
                        }
                    }
            
                    if (event.type === "audioStream" && event.data) {
                        try {
                            const audioData = decodeBase64ToUint8Array(event.data);
                            if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
                                sourceBufferRef.current.appendBuffer(audioData);
                            } else if (sourceBufferRef.current) {
                                audioBuffersRef.current.push(audioData);
                            }
                        } catch (err) {
                            console.error("Error processing audio chunk:", err);
                        }
                    }
                } catch (error) {
                    console.error("WebSocket message parse error:", error);
                }
            };            

            ws.onerror = (error) => console.error("WebSocket Error:", error);
            ws.onclose = () => {
                console.log("WebSocket closed");
                setIsRecording(false);
                setAgentState("idle");
                setCurrentMessage("");
                cleanupMediaSource();
            };
        } catch (error) {
            console.error("Error starting recording:", error);
            stopRecording();
        }
    };

    const startMediaRecorder = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = async (event) => {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    const base64Data = await blobToBase64(event.data);
                    sendAudio(base64Data);
                } else {
                    console.warn("WebSocket is not ready, discarding audio data.");
                }
            };

            mediaRecorder.start(500);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const cleanupMediaSource = () => {
        if (sourceBufferRef.current && mediaSourceRef.current) {
            try {
                if (mediaSourceRef.current.readyState === 'open') {
                    mediaSourceRef.current.endOfStream();
                }
            } catch (error) {
                console.error("Error ending media stream:", error);
            }
        }

        if (audioElementRef.current) {
            audioElementRef.current.pause();
            audioElementRef.current = null;
        }

        sourceBufferRef.current = null;
        mediaSourceRef.current = null;
        audioBuffersRef.current = [];
    };

    const stopRecording = () => {
        console.log("Stopping recording...");
        setIsRecording(false);
        setAgentState("idle");
        setCurrentMessage("");

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }

        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(track => track.stop());
            audioStreamRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        cleanupMediaSource();
    };

    const sendAudio = (base64Data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "audioIn", data: base64Data }));
        }
    };

    const decodeBase64ToUint8Array = (base64) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
        });
    };

    return { 
        isRecording, 
        agentState,
        currentMessage,
        startRecording, 
        stopRecording 
    };
}