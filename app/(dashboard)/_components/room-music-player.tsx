"use client"

import { cn } from "@/lib/utils"
import { Mic2, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { useEffect, useState } from "react"
import LyricsPanel from "@/app/components/lyrics-panel"

const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return "0:00"
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
}

const RoomMusicPlayer = ({
    currentSong,
    isPlaying,
    onPlay,
    isHost,
    onPause,
    currentTime,
    duration,
    audioRef,
    songId,
}: any) => {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0
    const [volume, setVolume] = useState(0.8)
    const [isMuted, setIsMuted] = useState(false)
    const [showLyrics, setShowLyrics] = useState(false)
    const [plainLyrics, setPlainLyrics] = useState<string | null>(null)
    const [syncedLyrics, setSyncedLyrics] = useState<string | null>(null)

    // Sync volume to audio element
    useEffect(() => {
        if (audioRef?.current) {
            audioRef.current.volume = isMuted ? 0 : volume
        }
    }, [volume, isMuted, audioRef])

    // Fetch lyrics when song changes
    useEffect(() => {
        if (!currentSong) return
        setPlainLyrics(null)
        setSyncedLyrics(null)
        fetch(`/api/songs/${currentSong.id}/lyrics`)
            .then((r) => r.json())
            .then((d) => {
                setPlainLyrics(d.plainLyrics ?? null)
                setSyncedLyrics(d.syncedLyrics ?? null)
            })
            .catch(() => {})
    }, [currentSong])

    return (
        <>
            <LyricsPanel
                plainLyrics={plainLyrics}
                syncedLyrics={syncedLyrics}
                currentTime={currentTime}
                isVisible={showLyrics}
                songId={currentSong?.id}
            />

            <div className="fixed bottom-0 md:bottom-4 left-0 md:left-4 right-0 md:right-4 h-20 md:h-22 bg-gradient-to-r from-[#0d0d16]/95 via-[#06060c]/98 to-[#0d0d16]/95 border-t md:border border-white/[0.06] md:rounded-2xl z-50 flex items-center justify-between px-4 md:px-6 gap-4 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
                {/* Tiny top progress bar for mobile */}
                <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white/[0.08] md:hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-100 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Left Area: Song details */}
                <div className="flex items-center gap-3 min-w-0 w-auto md:w-60 shrink-0">
                    {currentSong ? (
                        <>
                            <div className="relative flex-shrink-0 group">
                                <img
                                    src={currentSong.image}
                                    alt={currentSong.title}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-lg object-cover shadow-[0_4px_16px_rgba(0,0,0,0.4)] border border-white/5"
                                />
                                {isPlaying && (
                                    <div className="absolute inset-0 rounded-lg bg-purple-500/10 animate-pulse" />
                                )}
                            </div>
                            <div className="min-w-0 pr-2">
                                <p className="text-xs md:text-sm font-bold text-white truncate tracking-wide">
                                    {currentSong.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    {isPlaying && (
                                        <span className="flex items-center gap-0.5 h-2 w-3">
                                            <span className="w-[1.5px] h-full bg-purple-400 animate-[pulse_0.8s_infinite_alternate]" />
                                            <span className="w-[1.5px] h-[70%] bg-purple-400 animate-[pulse_0.5s_infinite_alternate]" />
                                            <span className="w-[1.5px] h-[40%] bg-purple-400 animate-[pulse_0.7s_infinite_alternate]" />
                                        </span>
                                    )}
                                    <p className="text-[10px] md:text-xs text-white/40 font-medium">
                                        Live Stream
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-white/40 text-xs md:text-sm font-semibold italic">No track selected</p>
                    )}
                </div>

                {/* Center Area: Play/Pause controls + timeline */}
                <div className="flex-1 flex flex-col items-center gap-2 max-w-xl">
                    {/* Buttons */}
                    <div className="flex items-center gap-5">
                        <button
                            onClick={isPlaying ? onPause : onPlay}
                            disabled={!isHost}
                            className={cn(
                                "w-10 h-10 md:w-12 md:h-12 rounded-full border-none flex items-center justify-center shrink-0 transition-all shadow-[0_4px_15px_rgba(168,85,247,0.3)]",
                                isHost
                                    ? "bg-gradient-to-br from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white cursor-pointer hover:scale-105 active:scale-95"
                                    : "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed"
                            )}
                            title={isHost ? (isPlaying ? "Pause Session" : "Play Session") : "Only Host can control playback"}
                        >
                            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                        </button>
                    </div>

                    {/* Timeline Slider (Desktop Only) */}
                    <div className="hidden md:flex items-center gap-3 w-full">
                        <span className="text-[10px] text-white/40 font-semibold w-10 text-right tabular-nums">
                            {formatTime(currentTime)}
                        </span>
                        <div className="flex-1 relative h-1">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-white/[0.08] rounded-full" />
                            <div 
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-white/40 font-semibold w-10 text-left tabular-nums">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Right Area: Lyrics + Volume */}
                <div className="flex items-center gap-1.5 md:gap-3.5 min-w-0 w-auto md:w-60 justify-end shrink-0">
                    {/* Lyrics toggle */}
                    <button
                        onClick={() => setShowLyrics(!showLyrics)}
                        disabled={!currentSong}
                        className={cn(
                            "p-2 rounded-xl transition-all duration-200 border",
                            showLyrics 
                                ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.1)]" 
                                : "text-white/40 hover:text-white hover:bg-white/5 border-transparent disabled:opacity-30 disabled:cursor-not-allowed"
                        )}
                        title="Lyrics"
                    >
                        <Mic2 size={16} />
                    </button>

                    {/* Volume Slider (Desktop Only) */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="text-white/40 hover:text-white transition-colors p-1.5"
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
                            className="w-16 h-1 accent-purple-500 bg-white/10 rounded-lg cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default RoomMusicPlayer