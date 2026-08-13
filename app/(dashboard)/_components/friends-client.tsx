"use client"

import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"
import { Search, UserPlus, UserCheck, UserMinus, Clock, Check, X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface User {
    id: string
    username: string
    image: string
}

interface FriendsClientProps {
    currentUser: {
        id: string
        username: string
    }
}

export default function FriendsClient({ currentUser }: FriendsClientProps) {
    const [activeTab, setActiveTab] = useState<"friends" | "pending" | "search">("friends")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [friends, setFriends] = useState<any[]>([])
    const [pending, setPending] = useState<any[]>([])
    const [sent, setSent] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [actionId, setActionId] = useState<string | null>(null)
    const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])

    const fetchFriendsData = async () => {
        try {
            const res = await fetch("/api/friends")
            if (res.ok) {
                const data = await res.json()
                setFriends(data.friends || [])
                setPending(data.pending || [])
                setSent(data.sent || [])
            }
        } catch (e) {
            console.error("Failed to fetch friends data", e)
        }
    }

    // Connect to Socket and set up listeners
    useEffect(() => {
        if (!socket.connected) {
            socket.connect()
        }
        
        socket.emit("identify", currentUser.id)
        socket.emit("get-online-users")

        const handleRequestReceived = () => {
            fetchFriendsData()
        }

        const handleRequestAccepted = () => {
            fetchFriendsData()
        }

        const handleOnlineUsersList = (userIds: string[]) => {
            setOnlineUserIds(userIds)
        }

        const handleUserStatusChanged = ({ userId, status }: { userId: string; status: "online" | "offline" }) => {
            setOnlineUserIds(prev => {
                if (status === "online") {
                    return prev.includes(userId) ? prev : [...prev, userId]
                } else {
                    return prev.filter(id => id !== userId)
                }
            })
        }

        socket.on("friend-request-received", handleRequestReceived)
        socket.on("friend-request-accepted", handleRequestAccepted)
        socket.on("online-users-list", handleOnlineUsersList)
        socket.on("user-status-changed", handleUserStatusChanged)

        fetchFriendsData()

        return () => {
            socket.off("friend-request-received", handleRequestReceived)
            socket.off("friend-request-accepted", handleRequestAccepted)
            socket.off("online-users-list", handleOnlineUsersList)
            socket.off("user-status-changed", handleUserStatusChanged)
        }
    }, [currentUser.id])

    // Search users
    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!searchQuery.trim()) return

        try {
            setLoading(true)
            const res = await fetch(`/api/friends?search=${encodeURIComponent(searchQuery)}`)
            if (res.ok) {
                const data = await res.json()
                setSearchResults(data.users || [])
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    // Send Friend Request
    const handleSendRequest = async (receiverUsername: string, receiverId: string) => {
        try {
            setActionId(receiverId)
            const res = await fetch("/api/friends", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverUsername })
            })
            if (res.ok) {
                // Emit socket event to notify other user instantly
                socket.emit("send-friend-request", {
                    requesterId: currentUser.id,
                    receiverId
                })
                await fetchFriendsData()
                setSearchQuery("")
                setSearchResults([])
                setActiveTab("friends")
            }
        } catch (e) {
            console.error(e)
        } finally {
            setActionId(null)
        }
    }

    // Accept / Reject Friend Request
    const handleRespond = async (friendshipId: string, action: "accept" | "reject", requesterId: string) => {
        try {
            setActionId(friendshipId)
            const res = await fetch(`/api/friends/${friendshipId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action })
            })
            if (res.ok) {
                if (action === "accept") {
                    socket.emit("accept-friend-request", {
                        requesterId,
                        receiverId: currentUser.id
                    })
                }
                await fetchFriendsData()
            }
        } catch (e) {
            console.error(e)
        } finally {
            setActionId(null)
        }
    }

    // Remove Friend
    const handleRemoveFriend = async (friendshipId: string) => {
        if (!confirm("Are you sure you want to remove this friend?")) return
        try {
            setActionId(friendshipId)
            const res = await fetch(`/api/friends/${friendshipId}`, {
                method: "DELETE"
            })
            if (res.ok) {
                await fetchFriendsData()
            }
        } catch (e) {
            console.error(e)
        } finally {
            setActionId(null)
        }
    }

    // Helper to check relationship status in search
    const getRelationshipStatus = (user: User) => {
        if (friends.some(f => f.id === user.id)) return "FRIEND"
        if (pending.some(p => p.requester.id === user.id)) return "PENDING_RECEIVED"
        if (sent.some(s => s.receiver.id === user.id)) return "PENDING_SENT"
        return "NONE"
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header Tabs */}
            <div className="flex gap-3 border-b border-border pb-4 mb-8">
                <button
                    onClick={() => setActiveTab("friends")}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border-none ${
                        activeTab === "friends"
                            ? "bg-primary text-white shadow-md shadow-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                    Friends ({friends.length})
                </button>
                <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 relative cursor-pointer border-none ${
                        activeTab === "pending"
                            ? "bg-primary text-white shadow-md shadow-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                    Pending ({pending.length})
                    {pending.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold animate-pulse">
                            {pending.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("search")}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer border-none ${
                        activeTab === "search"
                            ? "bg-primary text-white shadow-md shadow-primary/10"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                    Add Friend
                </button>
            </div>

            {/* Friends Tab */}
            {activeTab === "friends" && (
                <div className="space-y-4">
                    {friends.length === 0 ? (
                        <div className="text-center py-20 bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-foreground text-base font-bold">No friends added yet</p>
                            <p className="text-muted-foreground text-xs mt-1 font-medium">Search for users and add them to build your network.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {friends.map((friend) => {
                                const isOnline = onlineUserIds.includes(friend.id)
                                return (
                                    <div
                                        key={friend.id}
                                        className="bg-card border border-border p-4.5 rounded-2xl flex items-center justify-between hover:bg-secondary/40 transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={friend.image || "/default-avatar.png"}
                                                    alt={friend.username}
                                                    className="w-12 h-12 rounded-full object-cover border border-border"
                                                />
                                                {/* Real-time Status Indicator Dot */}
                                                <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                                                    isOnline ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
                                                }`} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-foreground text-sm md:text-base truncate tracking-tight">{friend.username}</p>
                                                <p className={`text-[10px] md:text-xs font-semibold mt-0.5 uppercase tracking-wider ${
                                                    isOnline ? "text-emerald-500" : "text-muted-foreground/50"
                                                }`}>
                                                    {isOnline ? "Active Now" : "Offline"}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveFriend(friend.friendshipId)}
                                            disabled={actionId === friend.friendshipId}
                                            className="text-muted-foreground/45 hover:text-red-500 p-2 rounded-full hover:bg-red-500/10 transition-colors disabled:opacity-50 shrink-0 cursor-pointer border-none bg-transparent"
                                            title="Remove Friend"
                                        >
                                            <UserMinus size={18} />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Pending Tab */}
            {activeTab === "pending" && (
                <div className="space-y-6">
                    {/* Received Requests */}
                    <div>
                        <h3 className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-3">Received Requests</h3>
                        {pending.length === 0 ? (
                            <p className="text-muted-foreground/60 text-xs font-medium py-2">No pending incoming requests.</p>
                        ) : (
                            <div className="space-y-2">
                                {pending.map((req) => (
                                    <div
                                        key={req.id}
                                        className="bg-card border border-border p-4 rounded-xl flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={req.requester.image || "/default-avatar.png"}
                                                alt={req.requester.username}
                                                className="w-10 h-10 rounded-full object-cover border border-border"
                                            />
                                            <p className="font-bold text-sm text-foreground">{req.requester.username}</p>
                                        </div>
                                        <div className="flex gap-1.5">
                                            <button
                                                onClick={() => handleRespond(req.id, "accept", req.requester.id)}
                                                disabled={actionId === req.id}
                                                className="bg-primary hover:bg-primary-hover text-white p-2 rounded-xl flex items-center justify-center transition shadow-sm border-none cursor-pointer"
                                                title="Accept"
                                            >
                                                <Check size={16} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => handleRespond(req.id, "reject", req.requester.id)}
                                                disabled={actionId === req.id}
                                                className="bg-secondary hover:bg-secondary/80 text-muted-foreground p-2 rounded-xl flex items-center justify-center transition border-none cursor-pointer"
                                                title="Decline"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sent Requests */}
                    <div>
                        <h3 className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-3">Sent Requests</h3>
                        {sent.length === 0 ? (
                            <p className="text-muted-foreground/60 text-xs font-medium py-2">No pending sent requests.</p>
                        ) : (
                            <div className="space-y-2">
                                {sent.map((req) => (
                                    <div
                                        key={req.id}
                                        className="bg-card border border-border p-4 rounded-xl flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={req.receiver.image || "/default-avatar.png"}
                                                alt={req.receiver.username}
                                                className="w-10 h-10 rounded-full object-cover border border-border"
                                            />
                                            <p className="font-bold text-sm text-foreground">{req.receiver.username}</p>
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary">
                                            <Clock size={12} /> PENDING
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Search / Add Friend Tab */}
            {activeTab === "search" && (
                <div className="space-y-6">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by username..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder-muted-foreground/60 focus:outline-none focus:border-primary/50 transition duration-200"
                            />
                        </div>
                        <Button type="submit" className="px-5 py-3 h-auto rounded-xl text-xs font-bold bg-primary hover:bg-primary-hover text-white border-none cursor-pointer">
                            Search
                        </Button>
                    </form>

                    {loading ? (
                        <p className="text-muted-foreground text-center py-10 text-sm">Searching...</p>
                    ) : (
                        <div className="space-y-2">
                            {searchResults.map((user) => {
                                const status = getRelationshipStatus(user)
                                return (
                                    <div
                                        key={user.id}
                                        className="bg-card border border-border p-4 rounded-xl flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={user.image || "/default-avatar.png"}
                                                alt={user.username}
                                                className="w-10 h-10 rounded-full object-cover border border-border"
                                            />
                                            <p className="font-bold text-sm text-foreground">{user.username}</p>
                                        </div>

                                        <div>
                                            {status === "FRIEND" && (
                                                <span className="text-[10px] text-primary font-bold flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                                                    <UserCheck size={12} /> FRIENDS
                                                </span>
                                            )}
                                            {status === "PENDING_RECEIVED" && (
                                                <span className="text-[10px] text-amber-600 font-bold flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                                    PENDING APPROVAL
                                                </span>
                                            )}
                                            {status === "PENDING_SENT" && (
                                                <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary border border-border/50">
                                                    <Clock size={12} /> SENT
                                                </span>
                                            )}
                                            {status === "NONE" && (
                                                <button
                                                    onClick={() => handleSendRequest(user.username, user.id)}
                                                    disabled={actionId === user.id}
                                                    className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition active:scale-95 border-none cursor-pointer"
                                                >
                                                    <UserPlus size={13} /> Add Friend
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                            {searchQuery && searchResults.length === 0 && !loading && (
                                <p className="text-muted-foreground text-center py-10 text-sm font-semibold">No users found matching &quot;{searchQuery}&quot;</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
