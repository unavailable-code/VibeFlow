"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Sparkles, X, Loader2, AlertCircle } from "lucide-react"

interface LyricLine {
    time: number   // seconds
    text: string
}

function parseLRC(lrc: string): LyricLine[] {
    const lines: LyricLine[] = []
    const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/g
    let match: RegExpExecArray | null
    while ((match = regex.exec(lrc)) !== null) {
        const minutes = parseInt(match[1])
        const seconds = parseInt(match[2])
        const centiseconds = parseInt(match[3].padEnd(3, "0"))
        const time = minutes * 60 + seconds + centiseconds / 1000
        const text = match[4].trim()
        if (text) lines.push({ time, text })
    }
    return lines.sort((a, b) => a.time - b.time)
}

interface LyricsPanelProps {
    plainLyrics?: string | null
    syncedLyrics?: string | null
    currentTime: number
    isVisible: boolean
    songId?: string
}

export default function LyricsPanel({
    plainLyrics,
    syncedLyrics,
    currentTime,
    isVisible,
    songId,
}: LyricsPanelProps) {
    const activeRef = useRef<HTMLParagraphElement | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    // Explanation states
    const [showExplanation, setShowExplanation] = useState(false)
    const [explanation, setExplanation] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Reset explanation states when song changes
    useEffect(() => {
        setExplanation(null)
        setShowExplanation(false)
        setError("")
    }, [songId])

    const fetchExplanation = async () => {
        if (!songId) return
        setLoading(true)
        setError("")
        try {
            const res = await fetch(`/api/songs/${songId}/explain`)
            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || "Failed to fetch explanation.")
            }
            setExplanation(data.explanation)
        } catch (e: any) {
            setError(e.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const handleExplainClick = () => {
        setShowExplanation(true)
        if (!explanation) {
            fetchExplanation()
        }
    }

    const parsed = useMemo<LyricLine[] | null>(() => {
        if (!syncedLyrics) return null
        const lines = parseLRC(syncedLyrics)
        return lines.length > 0 ? lines : null
    }, [syncedLyrics])

    const activeIndex = useMemo(() => {
        if (!parsed) return -1
        let idx = -1
        for (let i = 0; i < parsed.length; i++) {
            if (parsed[i].time <= currentTime) idx = i
            else break
        }
        return idx
    }, [parsed, currentTime])

    useEffect(() => {
        if (activeRef.current && containerRef.current) {
            activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }, [activeIndex])

    if (!isVisible) return null

    const parseMarkdown = (text: string) => {
        return text.split("\n").map((line, idx) => {
            if (line.startsWith("### ")) {
                return <h3 key={idx} className="text-sm font-bold text-purple-400 mt-4 mb-2 tracking-wide uppercase">{line.replace("### ", "")}</h3>
            }
            if (line.startsWith("## ")) {
                return <h2 key={idx} className="text-base font-bold text-purple-400 mt-5 mb-2 border-b border-white/5 pb-1 tracking-tight">{line.replace("## ", "")}</h2>
            }
            if (line.startsWith("# ")) {
                return <h1 key={idx} className="text-lg font-black text-white mt-6 mb-3 tracking-tight">{line.replace("# ", "")}</h1>
            }
            if (line.startsWith("- ")) {
                return <li key={idx} className="ml-4 list-disc text-white/70 my-1.5 text-xs md:text-sm leading-relaxed">{line.replace("- ", "")}</li>
            }
            if (line.trim() === "") {
                return <div key={idx} className="h-2" />
            }
            return <p key={idx} className="text-white/80 leading-relaxed my-2 text-xs md:text-sm">{line}</p>
        })
    }

    return (
        <div className="fixed bottom-20 md:bottom-24 left-0 md:left-4 right-0 md:right-4 h-[360px] md:h-[400px] bg-[#06060c]/95 md:rounded-t-2xl border-t border-x border-white/[0.06] z-40 flex flex-col md:flex-row overflow-hidden backdrop-blur-xl shadow-[0_-12px_40px_rgba(0,0,0,0.6)] transition-all duration-300">
            
            {/* Lyrics Container Column */}
            <div className="flex-1 flex flex-col relative h-full min-w-0">
                {/* AI Explainer Trigger Button */}
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={handleExplainClick}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-full text-xs font-bold transition-all duration-200 shadow-sm active:scale-95"
                    >
                        <Sparkles size={13} className="animate-pulse" />
                        AI Explain
                    </button>
                </div>

                {/* Lyrics Scrolling Area */}
                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto py-16 scroll-py-12 scrollbar-none"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {parsed ? (
                        <div className="flex flex-col items-center gap-6 px-6">
                            {parsed.map((line, i) => {
                                const isActive = i === activeIndex
                                const isPast = i < activeIndex
                                return (
                                    <p
                                        key={i}
                                        ref={isActive ? activeRef : null}
                                        className={`text-center max-w-xl transition-all duration-350 ease-out origin-center leading-relaxed ${
                                            isActive
                                                ? "text-white text-lg md:text-2xl font-black scale-102 tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.35)]"
                                                : isPast
                                                ? "text-white/20 text-sm md:text-base font-medium scale-98"
                                                : "text-white/45 text-sm md:text-base font-medium scale-98 hover:text-white/70"
                                        }`}
                                    >
                                        {line.text}
                                    </p>
                                )
                            })}
                        </div>
                    ) : plainLyrics ? (
                        <div className="px-6 max-w-xl mx-auto py-4">
                            <p className="text-white/60 leading-loose text-center text-sm md:text-base whitespace-pre-line font-medium">
                                {plainLyrics}
                            </p>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-white/30 font-medium">
                            No lyrics available
                        </div>
                    )}
                </div>
            </div>

            {/* AI Explanation Column / Drawer */}
            {showExplanation && (
                <div className="w-full md:w-[380px] xl:w-[440px] h-full border-t md:border-t-0 md:border-l border-white/[0.06] bg-black/40 backdrop-blur-xl z-20 flex flex-col p-5 overflow-hidden transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4 shrink-0">
                        <div className="flex items-center gap-2 text-purple-400">
                            <Sparkles size={15} />
                            <span className="font-bold text-xs tracking-wider uppercase">Gemini AI Explains</span>
                        </div>
                        <button
                            onClick={() => setShowExplanation(false)}
                            className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Explanations Content */}
                    <div className="flex-1 overflow-y-auto pr-1 pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40">
                                <Loader2 className="animate-spin text-purple-500" size={24} />
                                <span className="text-xs font-semibold">Gemini is analyzing the track...</span>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                                <AlertCircle className="text-red-400" size={24} />
                                <p className="text-red-400 text-xs font-semibold max-w-xs">{error}</p>
                                {error.includes("GEMINI_API_KEY") && (
                                    <p className="text-[10px] text-white/30 max-w-xs mt-1 leading-normal">
                                        Open the <code>.env</code> file in the project root and append:
                                        <br />
                                        <code className="block bg-white/5 p-2 rounded mt-2 select-all text-purple-300 font-mono">GEMINI_API_KEY=your_key_here</code>
                                    </p>
                                )}
                            </div>
                        ) : explanation ? (
                            <div className="text-left font-normal pr-1">
                                {parseMarkdown(explanation)}
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    )
}
