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
            className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[40px_minmax(200px,1fr)_minmax(150px,1fr)_80px_100px] items-center gap-4 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-1.5 hover:bg-white/[0.04] active:bg-white/[0.06]"
        >
            {/* Number / Play Icon */}
            <div className="hidden md:block text-white/40 text-sm text-center">
                <span className="group-hover:hidden">{index !== undefined ? index + 1 : "-"}</span>
                <Play size={14} fill="currentColor" className="hidden group-hover:block mx-auto text-purple-400" />
            </div>

            {/* Title & Image & Artist (Responsive Layout) */}
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.3)] border border-white/5 flex-shrink-0">
                    <img
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center md:hidden">
                        <Play size={14} fill="currentColor" className="text-white" />
                    </div>
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                        {name}
                    </p>
                    <p className="text-white/40 text-xs truncate mt-0.5 md:hidden">
                        {artistNames}
                    </p>
                </div>
            </div>

            {/* Artist Column (Desktop Only) */}
            <p className="hidden md:block text-white/50 text-sm truncate pr-4">
                {artistNames}
            </p>

            {/* Duration Column (Desktop Only) */}
            <p className="hidden md:block text-white/40 text-sm">
                {formatDuration(duration)}
            </p>

            {/* Actions (Always Visible but compact on mobile) */}
            <div className="flex items-center justify-end gap-1.5">
                <span className="md:hidden text-white/40 text-xs mr-2">{formatDuration(duration)}</span>
                {onAddToQueue && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToQueue()
                        }}
                        className="bg-transparent border-none text-white/40 cursor-pointer p-2 rounded-full transition-all duration-200 hover:text-purple-400 hover:bg-purple-500/10"
                        title="Add to Queue"
                    >
                        <Plus size={16} />
                    </button>
                )}
                <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent border-none text-white/40 cursor-pointer p-2 rounded-full transition-all duration-200 hover:text-white hover:bg-white/10"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>
        </div>
    )
}

export default SongComponent
