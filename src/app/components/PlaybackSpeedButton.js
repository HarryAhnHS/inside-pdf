"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

const PLAYBACK_SPEEDS = [
  { value: 0.25, label: "0.25x" },
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1, label: "1x" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 2, label: "2x" },
]

const PlaybackSpeedButton = ({ disabled, playbackSpeed, onSpeedChange }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled}
          size="sm"
          variant="ghost"
          className="h-8 px-2 text-xs font-medium flex items-center gap-1 text-muted-foreground hover:text-foreground"
        >
          {playbackSpeed}x
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {PLAYBACK_SPEEDS.map((speed) => (
          <DropdownMenuItem
            key={speed.value}
            onClick={() => onSpeedChange(speed.value)}
            className="text-xs"
          >
            {speed.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PlaybackSpeedButton 