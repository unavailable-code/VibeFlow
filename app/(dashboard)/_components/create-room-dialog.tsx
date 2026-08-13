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
                className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Dialog Container */}
            <div className="relative w-full max-w-md bg-[#0b0b14]/90 border border-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden transition-all transform animate-slide-up">
                {/* Top Accent Line */}
                <div className="h-[3px] w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500" />

                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-tight">Create a Room</h2>
                            <p className="text-white/40 text-xs mt-0.5 font-medium">Configure your live listening session</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Room Name Input */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Room Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleCreate()}
                            placeholder="e.g. Chill Beats with Friends"
                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all duration-200"
                            maxLength={40}
                        />
                    </div>

                    {/* Visibility Options */}
                    <div className="mb-5">
                        <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2.5">Room Visibility</label>
                        <div className="grid grid-cols-2 gap-3">
                            {visibilityOptions.map(opt => {
                                const Icon = opt.icon
                                const isSelected = visibility === opt.value
                                return (
                                    <button
                                        key={opt.value}
                                        onClick={() => setVisibility(opt.value)}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all duration-200",
                                            isSelected
                                                ? "bg-purple-600/10 border-purple-500/40 text-purple-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                                                : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.04]"
                                        )}
                                    >
                                        <Icon size={18} className={isSelected ? "text-purple-400" : "text-white/40"} />
                                        <span className="text-xs font-bold">{opt.label}</span>
                                        <span className="text-[10px] leading-normal opacity-60 font-medium px-1">{opt.desc}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Friend Inviter */}
                    {visibility === "invite" && friends.length > 0 && (
                        <div className="mb-5">
                            <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <UserPlus size={13} />
                                Invite Friends
                            </label>
                            <div className="max-h-32 overflow-y-auto flex flex-col gap-1 pr-1 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent">
                                {friends.map(f => {
                                    const isInvited = selectedFriends.includes(f.id)
                                    return (
                                        <button
                                            key={f.id}
                                            onClick={() => toggleFriend(f.id)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors",
                                                isInvited
                                                    ? "bg-purple-500/10 border border-purple-500/20 text-white"
                                                    : "hover:bg-white/[0.03] text-white/60 hover:text-white border border-transparent"
                                            )}
                                        >
                                            {f.image ? (
                                                <img src={f.image} alt={f.username} className="w-6.5 h-6.5 rounded-full object-cover border border-white/10" />
                                            ) : (
                                                <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                                    {f.username[0].toUpperCase()}
                                                </div>
                                            )}
                                            <span className="text-xs font-semibold">{f.username}</span>
                                            {isInvited && (
                                                <div className="ml-auto w-4.5 h-4.5 rounded-full bg-purple-500 flex items-center justify-center shadow-sm">
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
                        <p className="text-red-400 text-xs font-semibold mb-4">{error}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={loading || !name.trim()}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold text-sm transition-all hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
