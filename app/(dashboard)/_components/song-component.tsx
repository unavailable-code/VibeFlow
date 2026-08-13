"use client"

import { Play, Plus, MoreHorizontal } from "lucide-react"

interface SongProps {
    name: string
    image: string
    artist: any[]
    duration: number
    onClick: () => void
    onAddToQueue?: () => void
    index?: number
}

const formatDuration = (sec: number) => {
    if (!sec) return "0:00"
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
}

const SongComponent = ({ name, image, artist, duration, onClick, onAddToQueue, index }: SongProps) => {
    const artistNames = artist.map((a) => a.artist?.name || "Unknown").join(", ")

    return (
        <div
            onClick={onClick}
            className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[40px_minmax(200px,1fr)_minmax(150px,1fr)_80px_100px] items-center gap-4 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-1.5 hover:bg-secondary active:bg-secondary/80 border border-transparent hover:border-border shadow-sm"
        >
            {/* Number / Play Icon */}
            <div className="hidden md:block text-muted-foreground text-sm text-center">
                <span className="group-hover:hidden">{index !== undefined ? index + 1 : "-"}</span>
                <Play size={14} fill="currentColor" className="hidden group-hover:block mx-auto text-primary" />
            </div>

            {/* Title & Image & Artist (Responsive Layout) */}
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shadow-sm border border-border flex-shrink-0">
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center md:hidden">
                        <Play size={14} fill="currentColor" className="text-white" />
                    </div>
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {name}
                    </p>
                    <p className="text-muted-foreground text-xs truncate mt-0.5 md:hidden">
                        {artistNames}
                    </p>
                </div>
            </div>

            {/* Artist Column (Desktop Only) */}
            <p className="hidden md:block text-muted-foreground text-sm truncate pr-4">
                {artistNames}
            </p>

            {/* Duration Column (Desktop Only) */}
            <p className="hidden md:block text-muted-foreground text-sm">
                {formatDuration(duration)}
            </p>

            {/* Actions (Always Visible but compact on mobile) */}
            <div className="flex items-center justify-end gap-1.5">
                <span className="md:hidden text-muted-foreground text-xs mr-2">{formatDuration(duration)}</span>
                {onAddToQueue && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToQueue()
                        }}
                        className="bg-transparent border-none text-muted-foreground cursor-pointer p-2 rounded-full transition-all duration-200 hover:text-primary hover:bg-primary/10"
                        title="Add to Queue"
                    >
                        <Plus size={16} />
                    </button>
                )}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent border-none text-muted-foreground cursor-pointer p-2 rounded-full transition-all duration-200 hover:text-foreground hover:bg-secondary"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </div>
    )
}

export default SongComponent
