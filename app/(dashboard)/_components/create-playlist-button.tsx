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
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white font-bold text-sm shadow-md shadow-primary/10 active:scale-[0.98] transition-all duration-200 cursor-pointer border-none"
            >
                <Plus size={16} strokeWidth={2.5} />
                Create Playlist
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-300"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dialog Container */}
                    <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-[0_24px_80px_rgba(30,27,46,0.15)] overflow-hidden transition-all transform animate-slide-up">
                        {/* Top Accent Line */}
                        <div className="h-[3px] w-full bg-gradient-to-r from-primary to-accent" />

                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <Music2 size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground tracking-tight">Create Playlist</h2>
                                        <p className="text-muted-foreground text-xs mt-0.5 font-medium">Give your custom playlist a name</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
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
                                    className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground/60 outline-none focus:border-primary/50 focus:bg-secondary/80 transition-all duration-200"
                                    maxLength={50}
                                    autoFocus
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <p className="text-red-500 text-xs font-semibold mb-4">{error}</p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
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
            )}
        </>
    )
}

export default CreatePlaylistButton
