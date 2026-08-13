"use client"

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Music2, Users, Mic2, Headphones, ArrowRight, Zap } from "lucide-react"

const features = [
    {
        icon: Headphones,
        title: "Synchronized Playback",
        desc: "Listen to the same song at the same moment, no matter where you are.",
        color: "from-purple-500/20 to-purple-600/5",
        accent: "text-purple-400",
    },
    {
        icon: Users,
        title: "Social Rooms",
        desc: "Create or join listening rooms — public, friends-only, or invite-only.",
        color: "from-cyan-500/20 to-cyan-600/5",
        accent: "text-cyan-400",
    },
    {
        icon: Mic2,
        title: "Real-Time Lyrics",
        desc: "Follow along with synced lyrics that scroll as the music plays.",
        color: "from-fuchsia-500/20 to-fuchsia-600/5",
        accent: "text-fuchsia-400",
    },
    {
        icon: Zap,
        title: "Collaborative Queues",
        desc: "Add, reorder, and loop tracks together. Everyone's a DJ.",
        color: "from-amber-500/20 to-amber-600/5",
        accent: "text-amber-400",
    },
]

export default function RootLanding() {
    return (
        <div className="min-h-screen bg-[#08080f] text-white font-sans overflow-x-hidden">
            {/* Ambient background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-md bg-black/20">
                <div className="flex items-center gap-2">
                    <Music2 size={22} className="text-purple-400" />
                    <span className="text-2xl font-black tracking-tighter italic bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        VibeFlow
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <SignInButton mode="modal">
                        <button className="px-5 py-2.5 text-sm font-semibold text-white/80 hover:text-white border border-white/15 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all duration-200">
                            Sign In
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl hover:opacity-90 transition-opacity">
                            Get Started
                        </button>
                    </SignUpButton>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative z-10 flex flex-col items-center text-center pt-28 pb-24 px-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold mb-8 tracking-wide">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    MUSIC. TOGETHER. IN REAL-TIME.
                </div>

                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-6">
                    Listen Together,{" "}
                    <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                        Anywhere.
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed mb-12">
                    Create virtual rooms, share playlists, and vibe with your friends in real-time.
                    Experience the pulse of the digital studio from anywhere in the world.
                </p>

                <div className="flex items-center gap-4">
                    <SignUpButton mode="modal">
                        <button className="flex items-center gap-2 px-8 py-4 text-base font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl hover:opacity-90 transition-all duration-200 shadow-[0_4px_40px_rgba(168,85,247,0.4)]">
                            Start Listening <ArrowRight size={18} />
                        </button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                        <button className="flex items-center gap-2 px-8 py-4 text-base font-bold border border-white/15 rounded-2xl hover:bg-white/5 hover:border-white/25 transition-all duration-200">
                            Sign In
                        </button>
                    </SignInButton>
                </div>
            </section>

            {/* Feature Cards */}
            <section className="relative z-10 px-6 pb-32 max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Features</p>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">Sonic Social Ecosystem</h2>
                    <p className="text-white/40 text-lg mt-4 max-w-xl mx-auto">
                        Built for the next generation of music listeners who believe music is better when shared.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {features.map((f) => {
                        const Icon = f.icon
                        return (
                            <div
                                key={f.title}
                                className={`relative p-6 rounded-2xl border border-white/8 bg-gradient-to-br ${f.color} backdrop-blur-sm hover:border-white/15 transition-all duration-300 group`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-white/5 ${f.accent}`}>
                                    <Icon size={20} />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* CTA Banner */}
            <section className="relative z-10 px-6 pb-28 max-w-4xl mx-auto">
                <div className="rounded-3xl p-10 border border-white/8 bg-gradient-to-br from-purple-900/30 to-cyan-900/20 backdrop-blur text-center">
                    <h2 className="text-4xl font-black tracking-tight mb-3">Ready to join the VibeFlow?</h2>
                    <p className="text-white/50 mb-8">Create your free account and start listening with friends today.</p>
                    <SignUpButton mode="modal">
                        <button className="px-10 py-4 text-base font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-2xl hover:opacity-90 transition-opacity shadow-[0_4px_40px_rgba(168,85,247,0.35)]">
                            Get Started — It's Free
                        </button>
                    </SignUpButton>
                </div>
            </section>
        </div>
    )
}
