"use client";

import { useAgent } from "../hooks/useAgent";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Loader2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const VoiceAgent = ({ isExpanded, text }) => {
  const { isRecording, agentState, currentMessage, startRecording, stopRecording } = useAgent(text);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const buttonRef = useRef(null);
  const messageRef = useRef(null);

  // Animation for the record button
  useEffect(() => {
    if (isRecording && buttonRef.current) {
      // Create pulse animation
      gsap.to(buttonRef.current, {
        scale: 1.1,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    } else if (buttonRef.current) {
      // Reset animations
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3
      });
    }
  }, [isRecording]);

  // Animation for the message
  useEffect(() => {
    if (agentState === "speaking" && messageRef.current) {
      gsap.to(messageRef.current, {
        opacity: 0.5,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    } else if (messageRef.current) {
      gsap.to(messageRef.current, {
        opacity: 1,
        duration: 0.3
      });
    }
  }, [agentState]);

  // Expansion animation
  useEffect(() => {
    if (isExpanded) {
      gsap.to(containerRef.current, {
        height: "auto",
        duration: 0.5,
        ease: "power3.out",
        onStart: () => {
          gsap.to(contentRef.current, {
            opacity: 1,
            duration: 0.3,
            delay: 0.1
          });
        }
      });
    } else {
      gsap.to(contentRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.to(containerRef.current, {
            height: 0,
            duration: 0.5,
            ease: "power3.in"
          });
        }
      });
    }
  }, [isExpanded]);

  const getStatusMessage = () => {
    if (!isRecording) return "Click microphone to start";
    switch (agentState) {
      case "thinking": return "Agent is thinking...";
      case "speaking": return "Agent is speaking...";
      default: return "Listening...";
    }
  };

  return (
    <div 
      ref={containerRef}
      className="overflow-hidden"
      style={{ height: 0 }}
    >
      <div 
        ref={contentRef}
        className="px-6 pb-6 opacity-0"
      >
        <div className="w-full rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {agentState === "thinking" && <Loader2 className="h-4 w-4 animate-spin" />}
              <span className="text-sm text-muted-foreground">{getStatusMessage()}</span>
            </div>
            <Button 
              ref={buttonRef}
              variant="outline"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                "rounded-full transition-all duration-200 hover:bg-primary/90 dark:hover:bg-primary/90",
                isRecording && "bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white dark:text-white"
              )}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>

          {currentMessage && (
            <div 
              ref={messageRef}
              className="mt-4 text-sm text-muted-foreground"
            >
              {currentMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;