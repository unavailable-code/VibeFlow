"use client"

import { usePlayer } from "@/public/utils/player-store"
import { useEffect, useRef, useState } from "react"
import {
    Pause, Play, SkipBack, SkipForward,
    Volume2, VolumeX, Mic2, ListMusic
} from "lucide-react"
import LyricsPanel from "./lyrics-panel"
import QueuePanel from "./queue-panel"

const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00"
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
}

const MusicPlayer = () => {
    const {
        currentSong, isPlaying, next, prev,
        togglePlay, showLyrics, showQueue,
        toggleLyrics, toggleQueue,
    } = usePlayer()

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(0.8)
    const [isMuted, setIsMuted] = useState(false)
    const [plainLyrics, setPlainLyrics] = useState<string | null>(null)
    const [syncedLyrics, setSyncedLyrics] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    // Load song
    useEffect(() => {
        const audio = audioRef.current
        if (!audio || !currentSong) return

        audio.src = `/api/stream/${currentSong.fileName}`
        audio.load()
        audio.volume = isMuted ? 0 : volume

        const updateTime = () => { if (!isDragging) setCurrentTime(audio.currentTime) }
        const setMeta = () => setDuration(audio.duration || 0)
        const handleEnd = () => next()

        audio.addEventListener("timeupdate", updateTime)
        audio.addEventListener("loadedmetadata", setMeta)
        audio.addEventListener("ended", handleEnd)
        audio.play().catch(() => {})

        // Fetch lyrics
        setPlainLyrics(null)
        setSyncedLyrics(null)
        fetch(`/api/songs/${currentSong.id}/lyrics`)
            .then((r) => r.json())
            .then((d) => {
                setPlainLyrics(d.plainLyrics ?? null)
                setSyncedLyrics(d.syncedLyrics ?? null)
            })
            .catch(() => {})

        return () => {
            audio.removeEventListener("timeupdate", updateTime)
            audio.removeEventListener("loadedmetadata", setMeta)
            audio.removeEventListener("ended", handleEnd)
        }
    }, [currentSong])

    // Play/pause sync
    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        if (isPlaying) audio.play().catch(() => {})
        else audio.pause()
    }, [isPlaying])

    // Volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume
        }
    }, [volume, isMuted])

    if (!currentSong) return null

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0

    return (
        <>
            <LyricsPanel
                plainLyrics={plainLyrics}
                syncedLyrics={syncedLyrics}
                currentTime={currentTime}
                isVisible={showLyrics}
                songId={currentSong.id}
            />
            <QueuePanel isVisible={showQueue} />

            <div className="fixed bottom-0 md:bottom-4 left-0 md:left-4 right-0 md:right-4 h-20 md:h-22 bg-card border-t md:border border-border md:rounded-2xl z-50 flex items-center justify-between px-4 md:px-6 gap-4 backdrop-blur-xl shadow-lg">
                {/* Tiny top progress bar for mobile */}
                <div 
                    className="absolute top-0 left-0 right-0 h-[2.5px] bg-progress-bg cursor-pointer md:hidden"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const x = e.clientX - rect.left
                        const pct = x / rect.width
                        const newTime = pct * duration
                        if (audioRef.current) audioRef.current.currentTime = newTime
                        setCurrentTime(newTime)
                    }}
                >
                    <div 
                        className="h-full bg-progress-fill transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Left Area: Song details */}
                <div className="flex items-center gap-3 min-w-0 w-auto md:w-60 shrink-0">
                    <div className="relative flex-shrink-0 group">
                        <img
                            src={currentSong.image}
                            alt={currentSong.title}
                            className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-sm border border-border"
                        />
                        {isPlaying && (
                            <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse" />
                        )}
                    </div>
                    <div className="min-w-0 pr-2">
                        <p className="text-xs md:text-sm font-bold text-foreground truncate tracking-wide">
                            {currentSong.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {isPlaying && (
                                <span className="flex items-center gap-0.5 h-2 w-3">
                                    <span className="w-[1.5px] h-full bg-primary animate-[pulse_0.8s_infinite_alternate]" />
                                    <span className="w-[1.5px] h-[70%] bg-primary animate-[pulse_0.5s_infinite_alternate]" />
                                    <span className="w-[1.5px] h-[40%] bg-primary animate-[pulse_0.7s_infinite_alternate]" />
                                </span>
                            )}
                            <p className="text-[10px] md:text-xs text-muted-foreground font-medium">
                                Now Playing
                            </p>
                        </div>
                    </div>
                </div>

                {/* Center Area: Playback controls + timeline (timeline hidden on mobile) */}
                <div className="flex-1 flex flex-col items-center gap-2 max-w-xl">
                    {/* Buttons */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={prev}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-secondary active:scale-90"
                            title="Previous"
                        >
                            <SkipBack size={18} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 shrink-0 border-none"
                        >
                            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                        </button>

                        <button
                            onClick={next}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-secondary active:scale-90"
                            title="Next"
                        >
                            <SkipForward size={18} />
                        </button>
                    </div>

                    {/* Timeline Slider (Desktop Only) */}
                    <div className="hidden md:flex items-center gap-3 w-full">
                        <span className="text-[10px] text-muted-foreground font-semibold w-10 text-right tabular-nums">
                            {formatTime(currentTime)}
                        </span>
                        <div
                            className="flex-1 relative h-1 cursor-pointer group py-2"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const x = e.clientX - rect.left
                                const pct = x / rect.width
                                const newTime = pct * duration
                                if (audioRef.current) audioRef.current.currentTime = newTime
                                setCurrentTime(newTime)
                            }}
                        >
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-progress-bg rounded-full" />
                            <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-progress-fill rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                value={currentTime}
                                step={0.1}
                                onChange={(e) => {
                                    const t = Number(e.target.value)
                                    setCurrentTime(t)
                                    if (audioRef.current) audioRef.current.currentTime = t
                                }}
                                onMouseDown={() => setIsDragging(true)}
                                onMouseUp={() => setIsDragging(false)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-semibold w-10 text-left tabular-nums">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Right Area: Extra controls (Lyrics, Queue, Volume) */}
                <div className="flex items-center gap-1 md:gap-3.5 min-w-0 w-auto md:w-60 justify-end shrink-0">
                    {/* Lyrics toggle */}
                    <button
                        onClick={toggleLyrics}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                            showLyrics 
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                        }`}
                        title="Lyrics"
                    >
                        <Mic2 size={16} />
                    </button>

                    {/* Queue toggle */}
                    <button
                        onClick={toggleQueue}
                        className={`p-2 rounded-xl transition-all duration-200 ${
                            showQueue 
                                ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent"
                        }`}
                        title="Queue"
                    >
                        <ListMusic size={16} />
                    </button>

                    {/* Volume Slider (Desktop Only) */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-muted-foreground hover:text-foreground transition-colors p-1.5"
                        >
                            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>
                        <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={isMuted ? 0 : volume}
                            onChange={(e) => {
                                const v = Number(e.target.value)
                                setVolume(v)
                                setIsMuted(v === 0)
                            }}
                            className="w-16 h-1 accent-primary bg-progress-bg rounded-lg cursor-pointer"
                        />
                    </div>
                </div>

                <audio ref={audioRef} />
            </div>
        </>
    )
}

export default MusicPlayer
