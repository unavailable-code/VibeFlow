"use client"

import { Music2, Play } from "lucide-react"

const SharedQueue = ({ song, onSelect, isActive }: { song: any; onSelect: (s: any) => void; isActive?: boolean }) => {
    return (
        <div
            onClick={() => onSelect(song)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group border ${
                isActive
                    ? "bg-purple-600/10 border-purple-500/20 text-white"
                    : "border-transparent hover:bg-white/[0.04] hover:border-white/[0.06]"
            }`}
        >
            {/* Artwork */}
            <div className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden shadow-md border border-white/5">
                <img
                    src={song.image}
                    alt={song.title}
                    className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <Play size={12} fill="white" className="text-white" />
                </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate leading-tight ${isActive ? "text-purple-400" : "text-white group-hover:text-purple-400 transition-colors"}`}>
                    {song.title}
                </p>
                <p className="text-[11px] text-white/40 truncate mt-0.5 font-medium">
                    {song.artists?.map((a: any) => a.artist?.name).join(", ") || song.artist || "Unknown Artist"}
                </p>
            </div>

            {/* Now Playing indicator */}
            {isActive && (
                <div className="flex items-end gap-[2px] h-4 shrink-0">
                    <span className="w-[2px] rounded-full bg-purple-400 animate-[bounce_0.8s_infinite]" style={{ height: "40%" }} />
                    <span className="w-[2px] rounded-full bg-purple-400 animate-[bounce_0.5s_infinite_0.15s]" style={{ height: "100%" }} />
                    <span className="w-[2px] rounded-full bg-purple-400 animate-[bounce_0.7s_infinite_0.3s]" style={{ height: "60%" }} />
                </div>
            )}

            {/* Music icon fallback */}
            {!isActive && (
                <Music2 size={14} className="text-white/20 group-hover:text-white/40 transition-colors shrink-0" />
            )}
        </div>
    )
}

export default SharedQueue
