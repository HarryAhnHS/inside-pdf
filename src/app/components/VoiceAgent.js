"use client";

import { useAgent } from "../hooks/useAgent";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const VoiceAgent = ({ isExpanded, text }) => {
  const { isRecording, isSpeaking, startRecording, stopRecording } = useAgent(text);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isExpanded) {
      gsap.to(containerRef.current, {
        height: "auto",
        duration: 0.5,
        ease: "power3.out",
        onStart: () => {
          gsap.to(contentRef.current, { opacity: 1, duration: 0.3, delay: 0.1 });
        },
      });
    } else {
      gsap.to(contentRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.to(containerRef.current, { height: 0, duration: 0.5, ease: "power3.in" });
        },
      });
    }
  }, [isExpanded]);

  return (
    <div ref={containerRef} className="overflow-hidden" style={{ height: 0 }}>
      <div ref={contentRef} className="px-6 pb-6 opacity-0">
        <div className="w-full rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <>
                  <span className="text-sm text-muted-foreground">Agent Not Active</span>
                </>
              ) : isSpeaking ? (
                <span className="text-sm text-muted-foreground">Agent is Speaking...</span>
              ) : (
                <span className="text-sm text-muted-foreground">Listening...</span>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              className="rounded-full"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAgent;