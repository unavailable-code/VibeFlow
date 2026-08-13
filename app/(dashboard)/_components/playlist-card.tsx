"use client"

import { Minus, Play, Plus, Clock, Trash2, Loader2, Music } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { usePlayer } from "@/public/utils/player-store"

interface PlaylistSong {
    id: string
    position: number
    song: {
        id: string
        title: string
        image: string
        duration: number
        fileName: string
        artists: any[]
    }
}

interface DiscoverSong {
    id: string
    title: string
    image: string
    duration: number
    fileName: string
    artists: any[]
}

interface PlaylistCardProps {
    id: string
    name: string
    number: number
    isOpen: boolean
    onToggle: () => void
}

const formatDuration = (sec: number) => {
    if (!sec) return "0:00"
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
}

const PlaylistCard = ({ id, name, number, isOpen, onToggle }: PlaylistCardProps) => {
    const [loading, setLoading] = useState(false)
    const [playlistSongs, setPlaylistSongs] = useState<PlaylistSong[]>([])
    const [discoverSongs, setDiscoverSongs] = useState<DiscoverSong[]>([])
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const { setQueue } = usePlayer()

    const playSong = (song: any, index: number) => {
        if (playlistSongs.length > 0) {
            setQueue(playlistSongs.map(ps => ({ ...ps.song })), index)
        } else {
            setQueue([{ ...song }])
        }
    }

    const playAll = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (playlistSongs.length === 0) return
        setQueue(playlistSongs.map(ps => ({ ...ps.song })))
    }

    const handleClick = async () => {
        onToggle()
        if (isOpen) return
        fetchData()
    }

    const fetchData = async () => {
        try {
            setLoading(true)
            const req = await fetch(`/api/playlist/${id}/songs`)
            if (!req.ok) throw new Error("Failed")
            const data = await req.json()
            setPlaylistSongs(data.playlistSongs || [])
            setDiscoverSongs(data.discoverSongs || [])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const addToPlaylist = async (songId: string) => {
        try {
            setUpdatingId(songId)
            const req = await fetch(`/api/playlist/${id}/songs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ songId })
            })
            if (req.ok) await fetchData()
        } catch (e) {
            console.error(e)
        } finally {
            setUpdatingId(null)
        }
    }

    const removeFromPlaylist = async (playlistSongId: string) => {
        try {
            setUpdatingId(playlistSongId)
            const req = await fetch(`/api/playlist/${id}/songs?playlistSongId=${playlistSongId}`, {
                method: "DELETE"
            })
            if (req.ok) await fetchData()
        } catch (e) {
            console.error(e)
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="text-foreground w-full rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:border-border/80 hover:shadow-sm">
            {/* PLAYLIST CARD HEADER */}
            <div
                onClick={handleClick}
                className={`flex items-center gap-4 p-5 cursor-pointer transition-colors duration-200 ${
                    isOpen ? "bg-secondary" : "hover:bg-secondary/40"
                }`}
            >
                {/* Playlist Art Icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md shrink-0 transition-transform duration-300 group-hover:scale-102">
                    <Music size={28} className="text-white" />
                </div>
                
                {/* Playlist Meta details */}
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-base md:text-xl truncate tracking-tight">{name}</p>
                    <p className="text-muted-foreground text-xs md:text-sm mt-0.5 font-medium">
                        {isOpen ? playlistSongs.length : number} songs
                    </p>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isOpen && playlistSongs.length > 0 && (
                        <Button
                            onClick={playAll}
                            className="flex items-center gap-2 rounded-full px-4 h-9 text-xs font-bold tracking-wide transition-all duration-200 bg-primary hover:bg-primary-hover text-white border-none shadow-sm cursor-pointer"
                        >
                            <Play size={12} fill="currentColor" /> Play All
                        </Button>
                    )}
                    <button
                        onClick={async (e) => {
                            e.stopPropagation()
                            if (!confirm(`Are you sure you want to delete "${name}"?`)) return
                            try {
                                const res = await fetch(`/api/playlist/${id}`, {
                                    method: "DELETE"
                                })
                                if (res.ok) {
                                    window.location.reload()
                                } else {
                                    alert("Failed to delete playlist.")
                                }
                            } catch (err) {
                                console.error(err)
                            }
                        }}
                        className="p-2.5 rounded-full text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Playlist"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* EXPANDED CONTENT */}
            {isOpen && (
                <div className="border-t border-border bg-secondary/35 p-4 md:p-6 space-y-6">
                    {loading && playlistSongs.length === 0 ? (
                        <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground text-sm">
                            <Loader2 className="animate-spin text-primary" size={16} />
                            <span>Loading tracks...</span>
                        </div>
                    ) : (
                        <>
                            {/* PLAYLIST SONGS */}
                            {playlistSongs.length > 0 && (
                                <div className="space-y-1">
                                    {/* Grid Header */}
                                    <div className="hidden md:grid grid-cols-[40px_minmax(200px,2fr)_minmax(150px,1fr)_80px_60px] items-center px-4 py-2 border-b border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
                                        <div className="text-center">#</div>
                                        <div>Title</div>
                                        <div>Artist</div>
                                        <div><Clock size={14} className="mx-auto md:mx-0" /></div>
                                        <div></div>
                                    </div>

                                    {playlistSongs.map((ps, index) => (
                                        <div
                                            key={ps.id}
                                            onClick={() => playSong(ps.song, index)}
                                            className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[40px_minmax(200px,2fr)_minmax(150px,1fr)_80px_60px] items-center gap-4 px-4 py-2.5 rounded-xl cursor-pointer transition-colors duration-200 hover:bg-secondary active:bg-secondary/80 border border-transparent hover:border-border"
                                        >
                                            {/* Index/Play button */}
                                            <div className="hidden md:block text-muted-foreground text-sm text-center">
                                                <span className="group-hover:hidden">{index + 1}</span>
                                                <Play size={12} fill="currentColor" className="hidden group-hover:block mx-auto text-primary" />
                                            </div>

                                            {/* Image, Title, Artist */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <img src={ps.song.image} alt="cover" className="w-10 h-10 rounded-lg object-cover border border-border shadow-sm flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <span className="font-semibold text-sm text-foreground truncate block group-hover:text-primary transition-colors">{ps.song.title}</span>
                                                    <span className="text-muted-foreground text-xs truncate block md:hidden mt-0.5">
                                                        {ps.song.artists?.map(a => a.artist?.name).join(", ") || "Unknown"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Artist Column (Desktop) */}
                                            <div className="hidden md:block text-muted-foreground text-sm truncate">
                                                {ps.song.artists?.map(a => a.artist?.name).join(", ") || "Unknown"}
                                            </div>

                                            {/* Duration (Desktop) */}
                                            <div className="hidden md:block text-muted-foreground text-sm">
                                                {formatDuration(ps.song.duration)}
                                            </div>

                                            {/* Action Delete from Playlist */}
                                            <div className="flex items-center justify-end">
                                                <span className="md:hidden text-muted-foreground text-xs mr-2">{formatDuration(ps.song.duration)}</span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        removeFromPlaylist(ps.id)
                                                    }}
                                                    disabled={updatingId === ps.id}
                                                    className="p-2 rounded-full text-red-500/60 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50 cursor-pointer"
                                                >
                                                    {updatingId === ps.id ? (
                                                        <Loader2 className="animate-spin" size={14} />
                                                    ) : (
                                                        <Minus size={14} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* DISCOVER/ADD MORE */}
                            {discoverSongs.length > 0 && (
                                <div className="space-y-3 pt-4 border-t border-border">
                                    <h3 className="text-sm font-bold text-foreground tracking-wide px-4">Add Tracks to Playlist</h3>
                                    
                                    <div className="space-y-1">
                                        {discoverSongs.map((song) => (
                                            <div
                                                key={song.id}
                                                className="group grid grid-cols-[1fr_auto] md:grid-cols-[40px_minmax(200px,2fr)_minmax(150px,1fr)_80px_60px] items-center gap-4 px-4 py-2.5 rounded-xl transition-colors duration-200 hover:bg-secondary/40 border border-transparent"
                                            >
                                                <div className="hidden md:block"></div>
                                                
                                                {/* Image, Title, Artist */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <img src={song.image} alt="cover" className="w-10 h-10 rounded-lg object-cover border border-border shadow-sm flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <span className="font-semibold text-sm text-foreground truncate block">{song.title}</span>
                                                        <span className="text-muted-foreground text-xs truncate block md:hidden mt-0.5">
                                                            {song.artists?.map(a => a.artist?.name).join(", ") || "Unknown"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Artist Column (Desktop) */}
                                                <div className="hidden md:block text-muted-foreground text-sm truncate">
                                                    {song.artists?.map(a => a.artist?.name).join(", ") || "Unknown"}
                                                </div>

                                                {/* Duration (Desktop) */}
                                                <div className="hidden md:block text-muted-foreground text-sm">
                                                    {formatDuration(song.duration)}
                                                </div>

                                                {/* Action Add to Playlist */}
                                                <div className="flex items-center justify-end">
                                                    <span className="md:hidden text-muted-foreground text-xs mr-2">{formatDuration(song.duration)}</span>
                                                    <button
                                                        onClick={() => addToPlaylist(song.id)}
                                                        disabled={updatingId === song.id}
                                                        className="p-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground hover:bg-secondary transition-colors disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {updatingId === song.id ? (
                                                            <Loader2 className="animate-spin" size={14} />
                                                        ) : (
                                                            <Plus size={14} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default PlaylistCard