"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Globe, Lock, UserPlus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Visibility = "public" | "invite"

interface CreateRoomDialogProps {
    isOpen: boolean
    onClose: () => void
    friends?: Array<{ id: string; username: string; image?: string }>
}

const visibilityOptions: { value: Visibility; label: string; desc: string; icon: any }[] = [
    { value: "public", label: "Public Room", desc: "Anyone can discover and join", icon: Globe },
    { value: "invite", label: "Invite Only", desc: "Only people you select can join", icon: Lock },
]

export default function CreateRoomDialog({ isOpen, onClose, friends = [] }: CreateRoomDialogProps) {
    const router = useRouter()
    const [name, setName] = useState("")
    const [visibility, setVisibility] = useState<Visibility>("public")
    const [selectedFriends, setSelectedFriends] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const toggleFriend = (id: string) => {
        setSelectedFriends(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        )
    }

    const handleCreate = async () => {
        if (!name.trim()) {
            setError("Room name is required")
            return
        }
        setError("")
        setLoading(true)
        try {
            const res = await fetch("/api/room", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), visibility }),
            })
            if (!res.ok) throw new Error("Failed to create room")
            const room = await res.json()

            // Send invites if invite-only
            if (visibility === "invite" && selectedFriends.length > 0) {
                await Promise.all(
                    selectedFriends.map(friendId =>
                        fetch("/api/room/invite", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ roomId: room.id, friendId }),
                        })
                    )
                )
            }

            onClose()
            router.push(`/room/${room.id}`)
        } catch (e) {
            setError("Something went wrong. Try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Dialog Container */}
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-[0_24px_80px_rgba(30,27,46,0.15)] overflow-hidden transition-all transform animate-slide-up">
                {/* Top Accent Line */}
                <div className="h-[3px] w-full bg-gradient-to-r from-primary to-accent" />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground tracking-tight">Create a Room</h2>
                            <p className="text-muted-foreground text-xs mt-0.5 font-medium">Configure your live listening session</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Room Name Input */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Room Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleCreate()}
                            placeholder="e.g. Chill Beats with Friends"
                            className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground/60 outline-none focus:border-primary/50 focus:bg-secondary/80 transition-all duration-200"
                            maxLength={40}
                        />
                    </div>

                    {/* Visibility Options */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Room Visibility</label>
                        <div className="grid grid-cols-2 gap-3">
                            {visibilityOptions.map(opt => {
                                const Icon = opt.icon
                                const isSelected = visibility === opt.value
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => setVisibility(opt.value)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer",
                                            isSelected
                                                ? "bg-primary/10 border-primary text-primary shadow-sm"
                                                : "bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                                        )}
                                    >
                                        <Icon size={18} className={isSelected ? "text-primary" : "text-muted-foreground/60"} />
                                        <span className="text-xs font-bold">{opt.label}</span>
                                        <span className="text-[10px] leading-normal opacity-70 font-medium px-1">{opt.desc}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Friend Inviter */}
                    {visibility === "invite" && friends.length > 0 && (
                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <UserPlus size={13} />
                                Invite Friends
                            </label>
                            <div className="max-h-32 overflow-y-auto flex flex-col gap-1 pr-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                                {friends.map(f => {
                                    const isInvited = selectedFriends.includes(f.id)
                                    return (
                                        <button
                                            key={f.id}
                                            onClick={() => toggleFriend(f.id)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors border border-transparent cursor-pointer",
                                                isInvited
                                                    ? "bg-primary/10 border-primary/20 text-primary"
                                                    : "hover:bg-secondary/60 text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            {f.image ? (
                                                <img src={f.image} alt={f.username} className="w-6.5 h-6.5 rounded-full object-cover border border-border" />
                                            ) : (
                                                <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                                    {f.username[0].toUpperCase()}
                                                </div>
                                            )}
                                            <span className="text-xs font-semibold">{f.username}</span>
                                            {isInvited && (
                                                <div className="ml-auto w-4.5 h-4.5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                                                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                                        <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Error display */}
                    {error && (
                        <p className="text-red-500 text-xs font-semibold mb-4">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors text-sm font-semibold cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={loading || !name.trim()}
                            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer border-none shadow-sm"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin text-white" />
                                    Creating...
                                </>
                            ) : "Create"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
