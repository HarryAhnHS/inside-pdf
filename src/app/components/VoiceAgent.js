"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"

const myWs = new WebSocket('wss://api.play.ai/v1/talk/Agent-XP5tVPa8GDWym6j');

/*
 * [Agent Greeting]
 * Do you have any questions about the text on this page?
 *
 * [Agent Prompt]
 * Your only job is to answer questions about the current text on this page. 
 * Base your answers on the current text on the page. 
 * Try to keep your answers as concise as possible, while answering the root of the question comprehensively.  
 * Do not do anything else than answer questions related to the current text on the page. 
 * Do not offer to do anything else.
 * After answering one question, ask if they have any more questions about the text on this page. 
 * Repeat until they have no more questions, and then end the call immediately.
 */

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
        TOdo Agent here
      </div>
    </div>
  )
}

export default VoiceAgent