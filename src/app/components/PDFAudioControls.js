"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Loader2, FileAudio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import PDFAudioSettings from "./PDFAudioSettings"
import PlaybackSpeedButton from "./PlaybackSpeedButton"

const PDFAudioControls = ({ pageText }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)
  const [audio, setAudio] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const progressInterval = useRef(null)
  const abortControllerRef = useRef(null)

  // Default settings
  const [settings, setSettings] = useState({
    voice: "Angelo",
    speed: 1.3,
    temperature: 0.7,
  })

  useEffect(() => {
    if (pageText) {
      fetchAudio()
    }
    return () => {
      clearInterval(progressInterval.current)
      // Abort any pending fetch request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [pageText])

  useEffect(() => {
    // Audio player Unmount cleanup
    return () => {
      if (audio) {
        audio.pause()
        audio.src = ""
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      clearInterval(progressInterval.current)
      // Abort any pending fetch request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  useEffect(() => {
    if (audio) {
      const updateProgress = () => {
        // Update times based on playback rate
        setCurrentTime(audio.currentTime)
        setDuration(audio.duration || 0)
      }

      audio.addEventListener("timeupdate", updateProgress)
      audio.addEventListener("loadedmetadata", updateProgress)
      audio.addEventListener("ratechange", updateProgress)

      return () => {
        audio.removeEventListener("timeupdate", updateProgress)
        audio.removeEventListener("loadedmetadata", updateProgress)
        audio.removeEventListener("ratechange", updateProgress)
      }
    }
  }, [audio])

  const fetchAudio = async (formData) => {
    try {
      setIsLoading(true)
      setIsPlaying(false)

      if (audio) {
        audio.pause()
      }

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }

      // Abort previous fetch if exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Create new AbortController for this fetch
      abortControllerRef.current = new AbortController()

      // Use formData if provided, otherwise use current settings
      const requestData = formData || settings
      console.log('Sending TTS request with settings:', requestData)
      
      const response = await fetch(`/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: pageText,
          voice: requestData.voice,
          speed: requestData.speed,
          temperature: requestData.temperature,
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const url = URL.createObjectURL(audioBlob)
      setAudioUrl(url)
      const newAudio = new Audio(url)
      newAudio.preload = "metadata"
      setAudio(newAudio)

      newAudio.addEventListener("ended", () => setIsPlaying(false))
      newAudio.addEventListener("error", (e) => {
        console.error("Audio playback error:", e)
        setIsPlaying(false)
      })

      setIsLoading(false)

    } catch (error) {
      // Don't show error if it was due to abort
      if (error.name === 'AbortError') {
        console.log('Fetch aborted')
        return
      }
      console.error("Error generating audio:", error)
      setIsPlaying(false)
      setIsLoading(false)
    }
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
      if (audio) audio.pause()
    } else {
      setIsPlaying(true)
      if (audio) audio.play()
    }
  }

  const handleSeek = (value) => {
    if (audio) {
      const newTime = value[0]
      audio.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings)
  }

  const handleSettingsSubmit = (formData) => {
    fetchAudio(formData)
  }

  const handleSpeedChange = (speed) => {
    if (audio) {
      audio.playbackRate = speed
      setPlaybackSpeed(speed)
    }
  }

  return (
    <Card className="rounded-none border-none p-0 !bg-transparent shadow-none">
      <CardContent className="px-8 py-4">
        {isLoading ? (
          <div className="w-full flex-col items-center justify-center text-muted-foreground">
            <div className="flex justify-center items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Processing audio...</span>
            </div>
          </div>
        )
        :
          (
          <div className="border-t border-muted pt-3">
            {/* Audio player */}
            <div className="flex items-center">
              <Button
                onClick={handlePlayPause}
                disabled={!audioUrl}
                size="icon"
                variant={isPlaying ? "default" : "outline"}
                className="h-10 w-10 rounded-full flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>

                {/* Player progress slider bar */}
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-8 text-right flex-shrink-0">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 px-1">
                  <Slider
                    disabled={!audio}
                    min={0}
                    max={duration}
                    step={0.1}
                    value={[currentTime]}
                    onValueChange={handleSeek}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8 flex-shrink-0">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center">
                <PlaybackSpeedButton 
                  disabled={!audioUrl}
                  playbackSpeed={playbackSpeed}
                  onSpeedChange={handleSpeedChange}
                />
                <PDFAudioSettings 
                  settings={settings} 
                  onSettingsChange={handleSettingsChange}
                  onSubmit={handleSettingsSubmit}
                />
              </div>
            </div>
          </div>
          )
        }
      </CardContent>
    </Card>
  )
}

export default PDFAudioControls