"use client"

import { Plus, X, Loader2, Music2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const CreatePlaylistButton = ({ id }: { id: string }) => {
    const [name, setName] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleCreate = async () => {
        if (!name.trim()) {
            setError("Playlist name is required")
            return
        }
        setError("")
        setLoading(true)
        try {
            const req = await fetch("/api/playlist/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: id, name: name.trim() }),
            })
            if (!req.ok) throw new Error("Failed")
            setIsOpen(false)
            setName("")
            router.refresh()
        } catch (e) {
            setError("Something went wrong. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-bold text-sm shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] hover:shadow-[0_4px_24px_rgba(168,85,247,0.4)] active:scale-[0.98] transition-all duration-200"
            >
                <Plus size={16} strokeWidth={2.5} />
                Create Playlist
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dialog Container */}
                    <div className="relative w-full max-w-md bg-[#0b0b14]/90 border border-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] overflow-hidden transition-all transform animate-slide-up">
                        {/* Top Accent Line */}
                        <div className="h-[3px] w-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500" />

                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center">
                                        <Music2 size={20} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white tracking-tight">Create Playlist</h2>
                                        <p className="text-white/40 text-xs mt-0.5 font-medium">Give your custom playlist a name</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Input Field */}
                            <div className="mb-5">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                                    placeholder="e.g. Midnight Beats, Workout Mix..."
                                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all duration-200"
                                    maxLength={50}
                                    autoFocus
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-400 text-xs font-semibold mb-4">{error}</p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
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
            )}
        </>
    )
}

export default CreatePlaylistButton
