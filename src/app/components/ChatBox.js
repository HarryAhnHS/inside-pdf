"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, X, GripVertical } from "lucide-react";
import Draggable from "react-draggable";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

export default function ChatBox({ isExpanded, pageText, fullPdfText, pageNumber, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 400, height: 500 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const messagesEndRef = useRef(null);
    const nodeRef = useRef(null);

    // Initialize position on client-side only
    useEffect(() => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        setPosition({
            x: vw * 0.1, // 10% from left
            y: vh * 0.1  // 10% from top
        });
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleResize = (event, { size }) => {
        setDimensions({
            width: size.width,
            height: size.height
        });
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setLoading(true);

        const updatedMessages = [...messages, { role: "user", content: userMessage }];
        setMessages(updatedMessages);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages,
                    pageText,
                    fullPdfText,
                    pageNumber
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `API responded with status: ${res.status}`);
            }

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: data.choices[0].message.content 
            }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { 
                role: "assistant", 
                content: "Sorry, I encountered an error. Please try again." 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        if (e.key === "Escape") {
            handleClose();
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            <Draggable
                nodeRef={nodeRef}
                handle=".drag-handle"
                bounds="parent"
                position={position}
                onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
            >
                <div
                    ref={nodeRef}
                    className="pointer-events-auto"
                    style={{
                        display: isExpanded ? 'block' : 'none',
                        width: dimensions.width,
                        height: dimensions.height
                    }}
                >
                    <Resizable
                        width={dimensions.width}
                        height={dimensions.height}
                        onResize={handleResize}
                        minConstraints={[300, 400]}
                        maxConstraints={[800, 800]}
                    >
                        <Card className="w-full h-full flex flex-col py-1 gap-0 bg-background/95 backdrop-blur-sm">
                            <div className="flex items-center justify-between p-2 border-b">
                                <div className="flex items-center gap-2 cursor-move drag-handle">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Chat with AI about this document</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClose}
                                    className="h-8 w-8"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="h-full overflow-y-auto p-4 space-y-4">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                message.role === "user" ? "justify-end" : "justify-start"
                                            }`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 break-words text-sm leading-relaxed ${
                                                    message.role === "user"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted"
                                                }`}
                                            >
                                                {message.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                            <div className="p-4 border-t">
                                <div className="flex gap-2">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Type your message..."
                                        disabled={loading}
                                        className="text-sm"
                                    />
                                    <Button 
                                        onClick={handleSend} 
                                        disabled={loading || !input.trim()}
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </Resizable>
                </div>
            </Draggable>
        </div>
    );
}
