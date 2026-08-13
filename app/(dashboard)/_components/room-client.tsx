"use client"

import { useEffect, useRef, useState } from "react"
import { socket } from "@/lib/socket"
import SharedQueue from "./shared-queue"
import RoomMusicPlayer from "./room-music-player"
import Chat from "./chat"
import { useRouter } from "next/navigation"
import { Globe, Lock, LogOut, Headphones } from "lucide-react"
import { usePlayer } from "@/public/utils/player-store"

export default function RoomClient({ room, songs, user }: any) {
    const router = useRouter()
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const localPlayer = usePlayer()

    useEffect(() => {
        localPlayer.pause()
    }, [])

    const [currentSong, setCurrentSong] = useState<any>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [pendingSong, setPendingSong] = useState<any>(null)
    const audioUnlocked = useRef(false)
    const currentSongRef = useRef<any>(null)
    const pendingSongRef = useRef<any>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const roomId = room.id
    const isHost = room.hostId === user.id

    // Sync ref
    pendingSongRef.current = pendingSong

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const updateTime = () => {
            setCurrentTime(audio.currentTime)
            if (isHost && audio.currentTime > 0) {
                // Throttle seek events for lyrics sync
                if (Math.floor(audio.currentTime * 10) % 10 === 0) {
                    socket.emit("lyrics-seek", { roomId: room.id, currentTime: audio.currentTime })
                }
            }
        }
        const setMeta = () => setDuration(audio.duration || 0)

        audio.addEventListener("timeupdate", updateTime)
        audio.addEventListener("loadedmetadata", setMeta)

        return () => {
            audio.removeEventListener("timeupdate", updateTime)
            audio.removeEventListener("loadedmetadata", setMeta)
        }
    }, [room.id, isHost])

    const setCurrentSongBoth = (song: any) => {
        currentSongRef.current = song
        setCurrentSong(song)
    }

    useEffect(() => {
        const unlock = () => {
            if (audioUnlocked.current || !audioRef.current) return
            audioRef.current.volume = 0
            audioRef.current.play().then(() => {
                audioRef.current!.pause()
                audioRef.current!.volume = 0.8  // reset to audible level
                audioUnlocked.current = true

                // Auto-play the pending song if we got synced while locked
                if (pendingSongRef.current) {
                    const ps = pendingSongRef.current
                    audioRef.current!.src = ps.url
                    audioRef.current!.currentTime = ps.currentTime
                    audioRef.current!.play().then(() => {
                        setCurrentSongBoth(ps.song)
                        setPendingSong(null)
                    }).catch(() => {})
                }
            }).catch(() => {})
        }

        window.addEventListener("click", unlock, { once: true })
        return () => window.removeEventListener("click", unlock)
    }, [])

    const handleSelectedSong = async (song: any) => {
        if (!audioRef.current) return
        if (!isHost) return
        setCurrentSongBoth(song)

        const url = `/api/stream/${song.fileName}`
        audioRef.current.src = url
        audioRef.current.load()
        audioRef.current.currentTime = 0

        try {
            await audioRef.current.play()
        } catch {
            setPendingSong({ song, currentTime: 0, url })
            return
        }
        socket.emit("sync-song", {
            roomId,
            songId: song.id,
            url,
            currentTime: 0,
            timestamp: Date.now()
        })
    }

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const onPlay = () => setIsPlaying(true)
        const onPause = () => setIsPlaying(false)

        audio.addEventListener("play", onPlay)
        audio.addEventListener("pause", onPause)

        return () => {
            audio.removeEventListener("play", onPlay)
            audio.removeEventListener("pause", onPause)
        }
    }, [])

    useEffect(() => {
        socket.connect()
        // Join room and send current userId
        socket.emit("join-room", { roomId, userId: user.id })

        // Host responds to incoming users to sync state
        socket.on("user-joined", ({ socketId }) => {
            if (isHost && currentSongRef.current && audioRef.current) {
                socket.emit("request-sync-to-user", {
                    targetSocketId: socketId,
                    songId: currentSongRef.current.id,
                    url: audioRef.current.src,
                    currentTime: audioRef.current.currentTime,
                    timestamp: Date.now(),
                    isPlaying: !audioRef.current.paused
                })
            }
        })

        socket.on("sync-song", ({ songId, url, currentTime, timestamp, isPlaying: hostPlaying }) => {
            const song = songs.find((s: any) => s.id === songId)
            if (!song || !audioRef.current) return

            const seekTo = Math.max(0, currentTime) // directly use currentTime to avoid system-clock lag issues

            setCurrentSongBoth(song)
            audioRef.current.src = url
            audioRef.current.load()
            audioRef.current.currentTime = seekTo

            // Respect the host's playing status
            const shouldPlay = hostPlaying !== undefined ? hostPlaying : true

            if (shouldPlay) {
                audioRef.current.play().catch(() => {
                    setPendingSong({ song, currentTime: seekTo, url })
                })
            } else {
                audioRef.current.pause()
            }
        })

        socket.on("play", ({ currentTime, timestamp }) => {
            if (!audioRef.current) return
            const seekTo = Math.max(0, currentTime)
            audioRef.current.currentTime = seekTo
            audioRef.current.play().catch(() => {
                setPendingSong({
                    song: currentSongRef.current,
                    currentTime: seekTo,
                    url: audioRef.current!.src
                })
            })
        })

        socket.on("pause", ({ currentTime }) => {
            if (!audioRef.current) return
            audioRef.current.currentTime = currentTime
            audioRef.current.pause()
        })

        socket.on("room-closed", () => {
            alert("The host has closed the room. Redirecting to listening rooms...")
            router.push("/listening-rooms")
        })

        return () => {
            socket.off("user-joined")
            socket.off("sync-song")
            socket.off("play")
            socket.off("pause")
            socket.off("room-closed")
            socket.disconnect()
        }
    }, [roomId, songs, isHost, user.id, router])

    const handleLeaveRoom = async () => {
        if (isHost) {
            try {
                // Deactivate the room
                await fetch(`/api/room/${roomId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ isActive: false })
                })
                // Emit host-left to notify other clients in the room
                socket.emit("host-left", { roomId })
            } catch (e) {
                console.error("Failed to close room", e)
            }
        }
        router.push("/listening-rooms")
    }

    return (
        <div className="flex flex-col gap-5 flex-1 h-full w-full">
            {/* Header section */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl md:text-3xl font-extrabold text-foreground tracking-tight">{room.name}</h1>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-semibold animate-pulse border border-red-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        LIVE
                    </div>
                    {/* Visibility badge */}
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                        room.visibility === 'invite' 
                            ? 'text-amber-600 bg-amber-500/10 border-amber-500/20' 
                            : 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                    }`}>
                        {room.visibility === 'invite' ? <Lock size={12} /> : <Globe size={12} />}
                        {room.visibility === 'invite' ? 'Invite Only' : 'Public'}
                    </div>
                </div>

                {/* Leave Room Button */}
                <button
                    onClick={handleLeaveRoom}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-red-500/10 hover:text-red-500 border border-border hover:border-red-500/20 rounded-xl text-muted-foreground font-semibold text-sm transition-all cursor-pointer"
                >
                    <LogOut size={16} />
                    Leave Room
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 flex-1 items-stretch min-h-0">
                {/* Left panel: Shared Queue & Player */}
                <div className="flex flex-col bg-card border border-border rounded-2xl p-4 md:p-6 overflow-hidden min-h-0 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm md:text-base font-bold text-muted-foreground uppercase tracking-wider">Song Queue</h2>
                        <span className="text-[10px] text-muted-foreground/60 font-semibold">{songs?.length ?? 0} tracks</span>
                    </div>

                    {/* Song list area — player is fixed at bottom, no need to embed here */}
                    <div className="flex-1 overflow-y-auto flex flex-col gap-0.5 min-h-0 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                        {songs?.map((song: any) => (
                            <SharedQueue
                                key={song.id}
                                song={song}
                                onSelect={handleSelectedSong}
                                isActive={currentSong?.id === song.id}
                            />
                        ))}
                    </div>
                </div>

                {/* Right panel: Chat */}
                <div className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <Chat user={user} roomId={room.id} />
                </div>
            </div>

            {/* Fixed-bottom Room Player */}
            <RoomMusicPlayer
                currentSong={currentSong}
                isPlaying={isPlaying}
                isHost={isHost}
                currentTime={currentTime}
                duration={duration}
                audioRef={audioRef}
                songId={currentSong?.id}
                onPlay={() => {
                    if (!audioRef.current || !currentSong) return
                    audioRef.current.play()
                    if (isHost) {
                        socket.emit("play", {
                            roomId,
                            songId: currentSong.id,
                            currentTime: audioRef.current.currentTime,
                            timestamp: Date.now()
                        })
                    }
                }}
                onPause={() => {
                    if (!audioRef.current) return
                    audioRef.current.pause()
                    if (isHost) {
                        socket.emit("pause", {
                            roomId,
                            currentTime: audioRef.current.currentTime,
                        })
                    }
                }}
            />

            {/* Autoplay blocker notification */}
            {pendingSong && (
                <div
                    className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all cursor-pointer z-45 flex items-center gap-2 text-sm"
                    onClick={async () => {
                        if (!audioRef.current) return
                        audioRef.current.src = pendingSong.url
                        audioRef.current.currentTime = pendingSong.currentTime
                        await audioRef.current.play()
                        setCurrentSongBoth(pendingSong.song)
                        setPendingSong(null)
                    }}
                >
                    <Headphones size={16} />
                    Tap to sync playback
                </div>
            )}

            <audio ref={audioRef} preload="auto" />
        </div>
    )
}