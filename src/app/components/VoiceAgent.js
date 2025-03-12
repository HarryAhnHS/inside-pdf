"use client"

import { useRef, useEffect } from "react"
import { open as openEmbed } from '@play-ai/agent-web-sdk';
import { gsap } from "gsap"

const VoiceAgent = ({ isExpanded, text }) => {
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (isExpanded) {
      // Expand animation
      gsap.to(containerRef.current, {
        height: "auto",
        duration: 0.5,
        ease: "power3.out",
        onStart: () => {
          gsap.to(contentRef.current, {
            opacity: 1,
            duration: 0.3,
            delay: 0.1
          })
        }
      })
    } else {
      // Collapse animation
      gsap.to(contentRef.current, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.to(containerRef.current, {
            height: 0,
            duration: 0.5,
            ease: "power3.in"
          })
        }
      })
    }
  }, [isExpanded])

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
        TOdo Embed here
      </div>
    </div>
  )
}

export default VoiceAgent