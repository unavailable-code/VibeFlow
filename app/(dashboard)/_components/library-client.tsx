// app/(dashboard)/_components/library-client.tsx

"use client"

import { useState } from "react"
import PlaylistCard from "./playlist-card"

interface Playlist {
    id: string
    name: string
    songs: any[]
}

const LibraryClient = ({
    playlists
}: {
    playlists: Playlist[]
}) => {
    const [openPlaylist, setOpenPlaylist] = useState<string | null>(null)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
            {playlists.map((playlist) => (
                <div key={playlist.id} className={openPlaylist === playlist.id ? "col-span-full" : ""}>
                    <PlaylistCard
                        id={playlist.id}
                        name={playlist.name}
                        number={playlist.songs.length}
                        isOpen={openPlaylist === playlist.id}
                        onToggle={() =>
                            setOpenPlaylist(
                                openPlaylist === playlist.id
                                    ? null
                                    : playlist.id
                            )
                        }
                    />
                </div>
            ))}
        </div>
    )
}

export default LibraryClient