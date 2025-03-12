import { useState, useEffect, useRef } from "react";

const PLAYAI_WS_URL = "wss://api.play.ai/v1/talk/";
const agentId = process.env.PLAYAI_AGENT_ID;
const apiKey = process.env.PLAYAI_API_KEY;

// Custom hook to manage the WebSocket connection using ddynamic text data
const useAgent = (textData) => {
    const [isConnected, setIsConnected] = useState(false);
    const [audioChunks, setAudioChunks] = useState([]);
    const wsRef = useRef(null);

    useEffect(() => {
        if (!apiKey || !agentId || !textData) return;

        // Close existing WebSocket before opening a new one
        if (wsRef.current) {
            wsRef.current.close();
        }

        const ws = new WebSocket(`${PLAYAI_WS_URL}${agentId}`);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("connected!");
            setIsConnected(true);
            
            // Send setup message with textData
            ws.send(
            JSON.stringify({ 
                type: "setup", 
                apiKey, 
                outputSampleRate: 24000, // To reduce latency
                prompt: `The current text on the page is: ${textData}. Only use this text to answer the user's question.`, // Feed dynamic data
            })
            );
        };

        // Receive audio stream from ws server
        ws.onmessage = (message) => {
            const event = JSON.parse(message);

            if (event.type === "audioStream") {
            setAudioChunks((prev) => [...prev, message.data]);
            return;
            } 
        };

        // Handle errors and closed connection
        ws.onerror = (error) => console.error("WebSocket Error:", error);
        ws.onclose = () => setIsConnected(false);

        return () => {
            // Cleanup on unmount
            ws.close();
            setIsConnected(false);
        };
    }, [textData]); // Restart WebSocket when textData changes

    // Helper to audio stream to ws server in base64 format
    const sendAudio = (base64Data) => {
        wsRef.current?.send(JSON.stringify({ type: "audioIn", data: base64Data }));
    };

  return { isConnected, audioChunks, sendAudio };
}

export default useAgent;