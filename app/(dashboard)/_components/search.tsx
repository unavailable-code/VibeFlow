"use client"

import { useEffect, useRef, useState } from "react"
import { SearchIcon, Play, Plus, X, Loader2 } from "lucide-react"
import { usePlayer } from "@/public/utils/player-store"

interface SearchResult {
    id: string
    title: string
    image: string
    fileName: string
    duration?: number
    artists?: { artist: { name: string } }[]
    album?: { name: string } | null
}

const Search = () => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResult[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const { setCurrentSong, addToQueue } = usePlayer()

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    const handleSearch = (value: string) => {
        setQuery(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)

        if (!value.trim()) {
            setResults([])
            setIsOpen(false)
            return
        }

        debounceRef.current = setTimeout(async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/search?q=${encodeURIComponent(value.trim())}`)
                if (res.ok) {
                    const data = await res.json()
                    setResults(data.songs || [])
                    setIsOpen(true)
                }
            } catch (e) {
                console.error("Search failed", e)
            } finally {
                setLoading(false)
            }
        }, 300)
    }

    const handlePlay = (song: SearchResult) => {
        setCurrentSong({
            id: song.id,
            title: song.title,
            image: song.image,
            fileName: song.fileName,
            duration: song.duration ?? 0,
        })
        setIsOpen(false)
        setQuery("")
    }

    const handleAddToQueue = (song: SearchResult) => {
        addToQueue({
            id: song.id,
            title: song.title,
            image: song.image,
            fileName: song.fileName,
            duration: song.duration ?? 0,
        })
    }

    const formatDuration = (sec?: number) => {
        if (!sec) return ""
        const m = Math.floor(sec / 60)
        const s = Math.floor(sec % 60)
        return `${m}:${s.toString().padStart(2, "0")}`
    }

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md">
            {/* Input Wrapper */}
            <div className="flex items-center bg-card border border-border rounded-xl px-4 h-11 gap-3 focus-within:border-primary/50 focus-within:bg-card transition-all duration-200 shadow-sm">
                <SearchIcon size={16} className="text-muted-foreground shrink-0" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => { if (results.length > 0) setIsOpen(true) }}
                    placeholder="Search tracks, artists, albums..."
                    className="bg-transparent border-none outline-none text-foreground text-sm w-full placeholder-muted-foreground/60"
                />
                {loading && <Loader2 className="animate-spin text-primary shrink-0" size={14} />}
                {!loading && query && (
                    <button
                        onClick={() => { setQuery(""); setResults([]); setIsOpen(false) }}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* Redesigned Search Results dropdown */}
            {isOpen && (
                <div className="absolute top-full mt-2.5 left-0 right-0 bg-card border border-border backdrop-blur-xl rounded-xl shadow-[0_12px_32px_rgba(30,27,46,0.12)] max-h-[360px] overflow-y-auto z-[60] divide-y divide-border animate-slide-up">
                    {results.length === 0 ? (
                        <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                            No results found for &quot;{query}&quot;
                        </div>
                    ) : (
                        <div className="py-1">
                            {results.map((song) => (
                                <div
                                    key={song.id}
                                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-secondary cursor-pointer transition-colors group"
                                    onClick={() => handlePlay(song)}
                                >
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0 shadow-sm">
                                        <img
                                            src={song.image}
                                            alt={song.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Play size={12} fill="currentColor" className="text-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                            {song.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5 font-medium">
                                            {song.artists?.map(a => a.artist?.name).join(", ") || "Unknown"}
                                            {song.album?.name ? ` • ${song.album.name}` : ""}
                                        </p>
                                    </div>
                                    
                                    <span className="text-xs text-muted-foreground group-hover:hidden shrink-0 font-medium tracking-wide">
                                        {formatDuration(song.duration)}
                                    </span>
                                    
                                    {/* Action Buttons on Hover */}
                                    <div className="hidden group-hover:flex items-center gap-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => handlePlay(song)}
                                            className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
                                            title="Play now"
                                        >
                                            <Play size={12} fill="currentColor" />
                                        </button>
                                        <button
                                            onClick={() => handleAddToQueue(song)}
                                            className="p-1.5 rounded-full hover:bg-primary/10 text-primary transition-colors"
                                            title="Add to queue"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Search
