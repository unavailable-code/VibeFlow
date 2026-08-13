"use client"

const WORDS = ["Sync", "Share", "Vibe", "Queue", "Lyrics", "Rooms", "Listen", "Together"]

export function Marquee() {
    const track = [...WORDS, ...WORDS]

    return (
        <div className="vf-marquee overflow-hidden border-y border-[#E9E5F1] py-4 bg-white/30">
            <div className="vf-marquee-track flex gap-10 whitespace-nowrap">
                {track.map((word, i) => (
                    <span key={i} className="flex items-center gap-10 text-sm font-medium tracking-widest uppercase text-[#9892AD]">
                        {word}
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]/50" />
                    </span>
                ))}
            </div>
        </div>
    )
}
