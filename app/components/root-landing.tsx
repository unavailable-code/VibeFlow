"use client"

import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Music2, Headphones, Users, Mic2, Zap, ArrowUpRight } from "lucide-react"
import { VinylDisc } from "./landing/vinyl-disc"
import { AudioCanvas } from "./landing/audio-canvas"
import { Marquee } from "./landing/marquee"

const features = [
    {
        icon: Headphones,
        title: "Synced Playback",
        desc: "Same song, same second — anywhere in the world.",
    },
    {
        icon: Users,
        title: "Social Rooms",
        desc: "Public, private, or friends-only listening spaces.",
    },
    {
        icon: Mic2,
        title: "Live Lyrics",
        desc: "Lyrics scroll in real time as the track plays.",
    },
    {
        icon: Zap,
        title: "Shared Queue",
        desc: "Everyone adds tracks. Everyone's a DJ.",
    },
]

const stats = [
    { value: "Sync", label: "Zero lag playback" },
    { value: "Live", label: "Real-time lyrics" },
    { value: "Free", label: "Start instantly" },
]

export default function RootLanding() {
    return (
        <div className="vf-page min-h-screen overflow-x-hidden">

            <div className="vf-ambient fixed inset-0 pointer-events-none" aria-hidden>
                <div className="vf-orb vf-orb-1" />
                <div className="vf-orb vf-orb-2" />
                <div className="vf-orb vf-orb-3" />
                <div className="vf-grain" />
            </div>

            <header className="relative z-30 px-6 md:px-10 pt-6">
                <nav className="max-w-6xl mx-auto flex items-center justify-between py-3 px-5 rounded-2xl bg-white/75 backdrop-blur-2xl border border-[#E9E5F1]/80 shadow-[0_4px_20px_rgba(22,19,42,0.04)]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#7C5CFC] flex items-center justify-center shadow-lg shadow-[#7C5CFC]/30">
                            <Music2 size={15} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-[15px] font-semibold tracking-tight vf-text-primary">VibeFlow</span>
                    </div>
                    <SignInButton mode="modal">
                        <button className="text-[13px] font-medium vf-text-muted hover:text-[var(--vf-text)] transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-[#7C5CFC]/6">
                            Sign In
                        </button>
                    </SignInButton>
                </nav>
            </header>

            <main className="relative z-10">
                <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-8">
                    <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-8 items-center">
                        <div className="text-center lg:text-left">
                            <p className="vf-reveal vf-d1 inline-flex items-center gap-2 vf-eyebrow px-4 py-2 rounded-full bg-[#7C5CFC]/8 border border-[#7C5CFC]/12 mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
                                Social music, reimagined
                            </p>

                            <h1 className="vf-reveal vf-d2 text-[clamp(2.5rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.03em] vf-text-primary">
                                Listen
                                <br />
                                <span className="text-[#7C5CFC]">together.</span>
                            </h1>

                            <p className="vf-reveal vf-d3 mt-6 text-base md:text-lg vf-text-body max-w-md mx-auto lg:mx-0 leading-relaxed">
                                Real-time rooms, synced playback, and shared queues — built for people who never listen alone.
                            </p>

                            <div className="vf-reveal vf-d4 flex flex-wrap justify-center lg:justify-start gap-3 mt-9">
                                <SignUpButton mode="modal">
                                    <button className="group inline-flex items-center gap-2 bg-[#16132A] text-white text-sm font-semibold px-6 py-3 rounded-full cursor-pointer transition-all hover:bg-[#7C5CFC] hover:shadow-xl hover:shadow-[#7C5CFC]/25 hover:-translate-y-0.5">
                                        Get Started
                                        <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
                                    </button>
                                </SignUpButton>
                                <SignInButton mode="modal">
                                    <button className="text-sm font-medium vf-text-body px-6 py-3 rounded-full border border-[#E9E5F1] bg-white/70 hover:bg-white hover:border-[#7C5CFC]/25 hover:text-[#7C5CFC] transition-all cursor-pointer">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </div>

                            <div className="vf-reveal vf-d5 hidden md:flex items-center gap-8 mt-12 pt-8 border-t border-[#E9E5F1]">
                                {stats.map((s, i) => (
                                    <div key={s.value} className="contents">
                                        {i > 0 && <div className="w-px h-8 bg-[#E9E5F1]" />}
                                        <div>
                                            <p className="text-2xl vf-stat-value tracking-tight">{s.value}</p>
                                            <p className="text-xs vf-stat-label mt-0.5">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="vf-reveal vf-d3 flex justify-center lg:justify-end">
                            <VinylDisc />
                        </div>
                    </div>
                </section>

                <div className="vf-reveal vf-d4 relative h-28 md:h-36 mt-4">
                    <AudioCanvas />
                </div>

                <Marquee />

                <section id="features" className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-28">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <p className="vf-eyebrow mb-3">Features</p>
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] vf-text-primary">
                                Everything to vibe
                            </h2>
                        </div>
                        <p className="text-sm vf-text-muted max-w-xs leading-relaxed">
                            The best songs were never meant to be heard alone.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                        {features.map((f, i) => {
                            const Icon = f.icon
                            return (
                                <article
                                    key={f.title}
                                    className="vf-feature group p-6 md:p-7 rounded-2xl bg-white/80 border border-[#E9E5F1]/80 hover:border-[#7C5CFC]/30 hover:bg-white transition-all duration-500 shadow-[0_2px_12px_rgba(22,19,42,0.03)] hover:shadow-[0_8px_30px_rgba(124,92,252,0.08)]"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/10 flex items-center justify-center transition-colors group-hover:bg-[#7C5CFC]/18">
                                            <Icon size={18} className="text-[#6845E8]" strokeWidth={1.75} />
                                        </div>
                                        <span className="text-[10px] font-mono vf-text-faint">0{i + 1}</span>
                                    </div>
                                    <h3 className="mt-5 text-[15px] font-semibold vf-text-primary">{f.title}</h3>
                                    <p className="mt-1.5 text-sm vf-text-muted leading-relaxed">{f.desc}</p>
                                </article>
                            )
                        })}
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
                    <div className="relative rounded-3xl overflow-hidden aspect-[21/9] min-h-[180px]">
                        <img
                            src="/concert-grid.png"
                            alt="Live music sessions"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#16132A]/80 via-[#16132A]/35 to-transparent" />
                        <div className="absolute inset-0 flex items-center p-8 md:p-12">
                            <div>
                                <p className="vf-eyebrow text-[#C4B5FD] mb-2">Live sessions</p>
                                <p className="text-white text-xl md:text-3xl font-semibold tracking-tight max-w-md leading-snug">
                                    Music hits different when you&apos;re not alone.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
                    <div className="relative rounded-3xl bg-[#16132A] p-10 md:p-16 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#7C5CFC]/35 blur-[80px] pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#E879A8]/25 blur-[60px] pointer-events-none" />

                        <div className="relative z-10 max-w-lg">
                            <p className="vf-eyebrow text-[#A78BFA] mb-4">Join VibeFlow</p>
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] leading-tight text-white">
                                Your next favorite song is waiting in a room.
                            </h2>
                            <p className="mt-4 text-[#C8C4D8] text-sm md:text-base leading-relaxed">
                                Create a free account and start listening with friends in seconds.
                            </p>
                            <SignUpButton mode="modal">
                                <button className="mt-8 group inline-flex items-center gap-2 bg-white text-[#16132A] text-sm font-semibold px-6 py-3 rounded-full cursor-pointer transition-all hover:bg-[#7C5CFC] hover:text-white hover:shadow-xl hover:shadow-[#7C5CFC]/35 hover:-translate-y-0.5">
                                    Get Started Free
                                    <ArrowUpRight size={15} className="transition-transform group-hover:rotate-45" />
                                </button>
                            </SignUpButton>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 border-t border-[#E9E5F1] px-6 md:px-10 py-6 bg-white/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs vf-text-faint">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-[#7C5CFC] flex items-center justify-center">
                            <Music2 size={10} className="text-white" strokeWidth={2.5} />
                        </div>
                        <span className="font-medium vf-text-muted">VibeFlow</span>
                    </div>
                    <p className="vf-text-faint">© {new Date().getFullYear()} VibeFlow</p>
                    <div className="flex gap-4 vf-text-muted">
                        <a href="#" className="hover:text-[#7C5CFC] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#7C5CFC] transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
