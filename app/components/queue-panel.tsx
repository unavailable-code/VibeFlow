"use client"

import { usePlayer } from "@/public/utils/player-store"
import { X, ListMusic, Trash2, Play } from "lucide-react"

interface QueuePanelProps {
    isVisible: boolean
}

const formatDuration = (sec?: number) => {
    if (!sec) return ""
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
}

export default function QueuePanel({ isVisible }: QueuePanelProps) {
    const { queue, currentIndex, removeFromQueue, clearQueue, setQueue } = usePlayer()

    if (!isVisible) return null

    return (
        <div className="fixed bottom-20 md:bottom-24 right-0 md:right-4 w-full md:w-[360px] h-[360px] md:h-[400px] bg-card md:rounded-t-2xl border-t border-x border-border z-45 flex flex-col overflow-hidden shadow-lg transition-all duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                    <ListMusic size={16} className="text-primary" />
                    <span className="text-sm font-bold text-foreground tracking-tight">
                        Queue ({queue.length})
                    </span>
                </div>
                {queue.length > 0 && (
                    <button
                        onClick={clearQueue}
                        className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-red-500 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-secondary"
                    >
                        <Trash2 size={12} />
                        Clear
                    </button>
                )}
            </div>

            {/* Song list */}
            <div className="flex-1 overflow-y-auto scrollbar-none">
                {queue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground/40 gap-3">
                        <ListMusic size={28} className="text-muted-foreground/30" />
                        <p className="text-xs font-semibold italic">Your queue is empty</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/40">
                        {queue.map((song, index) => {
                            const isActive = index === currentIndex
                            return (
                                <div
                                    key={`${song.id}-${index}`}
                                    onClick={() => setQueue(queue, index)}
                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-l-2 ${
                                        isActive 
                                            ? "bg-primary/10 border-primary" 
                                            : "border-transparent hover:bg-secondary/60"
                                    }`}
                                >
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0">
                                        <img
                                            src={song.image}
                                            alt={song.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className={`absolute inset-0 bg-black/15 flex items-center justify-center transition-opacity ${isActive ? "opacity-100" : "opacity-0 hover:opacity-100"}`}>
                                            <Play size={12} fill="currentColor" className={isActive ? "text-primary" : "text-white"} />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs md:text-sm font-semibold truncate ${
                                            isActive ? "text-primary" : "text-foreground"
                                        }`}>
                                            {song.title}
                                        </p>
                                        {song.duration && (
                                            <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                                                {formatDuration(song.duration)}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeFromQueue(index)
                                        }}
                                        className="p-2 rounded-full text-muted-foreground/45 hover:text-red-500 hover:bg-secondary transition-colors shrink-0"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
