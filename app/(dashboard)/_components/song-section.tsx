"use client"

import SongComponent from "./song-component"
import { usePlayer } from "@/public/utils/player-store"
import { Clock } from "lucide-react"

export default function SongList({ songs }: { songs: any[] }) {
    const { setQueue, addToQueue } = usePlayer()

    const handlePlaySong = (index: number) => {
        const queueSongs = songs.map(s => ({
            id: s.id,
            title: s.title,
            image: s.image,
            fileName: s.fileName,
            duration: s.duration,
        }))
        setQueue(queueSongs, index)
    }

    const handleAddToQueue = async (song: any) => {
        const s = {
            id: song.id,
            title: song.title,
            image: song.image,
            fileName: song.fileName,
            duration: song.duration,
        }
        addToQueue(s)
        
        try {
            await fetch("/api/queue", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ songId: song.id })
            })
        } catch (e) {
            console.error("Failed to add to DB queue", e)
        }
    }

    if (!songs || songs.length === 0) {
        return <div className="p-5 text-muted-foreground font-medium">No songs found.</div>
    }

    return (
        <div className="mt-8 pb-[100px]">
            {/* Header Row */}
            <div className="hidden md:grid grid-cols-[40px_minmax(200px,1fr)_minmax(150px,1fr)_80px_100px] px-4 py-2 border-b border-border mb-4 text-muted-foreground text-[0.8rem] uppercase tracking-wider font-semibold">
                <div className="text-center">#</div>
                <div>Title</div>
                <div>Artist</div>
                <div><Clock size={16} /></div>
                <div className="text-right pr-4">Actions</div>
            </div>

            {/* List */}
            <div>
                {songs.map((song, index) => (
                    <SongComponent
                        key={song.id}
                        index={index}
                        artist={song.artists || []}
                        image={song.image}
                        name={song.title}
                        duration={song.duration}
                        onClick={() => handlePlaySong(index)}
                        onAddToQueue={() => handleAddToQueue(song)}
                    />
                ))}
            </div>
        </div>
    )
}
