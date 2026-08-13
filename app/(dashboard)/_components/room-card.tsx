"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Globe, Lock, Users } from 'lucide-react'

interface RoomCardProps {
    name: string
    hostId: string
    roomId: string
    visibility?: string
}

const visibilityConfig: Record<string, { label: string; icon: any; color: string }> = {
    public: { label: "Public", icon: Globe, color: "text-emerald-400" },
    friends: { label: "Friends", icon: Users, color: "text-cyan-400" },
    invite: { label: "Invite Only", icon: Lock, color: "text-amber-400" },
}

const RoomCard = ({ name, hostId, roomId, visibility = "public" }: RoomCardProps) => {
    const router = useRouter()
    const vis = visibilityConfig[visibility] ?? visibilityConfig.public
    const VisIcon = vis.icon

    return (
        <div 
            className="w-full bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 flex flex-col gap-4 transition-all duration-300 cursor-pointer hover:border-white/[0.08] hover:bg-white/[0.03] group shadow-[0_4px_24px_rgba(0,0,0,0.15)]"
            onClick={() => router.push(`/room/${roomId}`)}
        >
            {/* Visual Header */}
            <div className="aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-cyan-500 relative flex items-center justify-center overflow-hidden shadow-inner">
                {/* Neon Overlay on hover */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                
                {/* Live Badge */}
                <div className="absolute top-2.5 left-2.5 bg-black/60 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-white backdrop-blur-sm shadow-sm">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                    </span>
                    LIVE
                </div>
                
                {/* Visibility badge */}
                <div className={`absolute top-2.5 right-2.5 bg-black/60 px-2.5 py-1 rounded-full flex items-center gap-1 text-[10px] font-extrabold backdrop-blur-sm shadow-sm ${vis.color}`}>
                    <VisIcon size={10} />
                    {vis.label.toUpperCase()}
                </div>
                
                <Users size={40} className="text-white/90 group-hover:scale-105 transition-transform duration-300" />
            </div>

            {/* Details */}
            <div className="min-w-0">
                <h3 className="text-sm md:text-base font-bold text-white truncate tracking-tight mb-0.5 group-hover:text-purple-400 transition-colors duration-200">{name}</h3>
                <p className="text-[10px] md:text-xs text-white/40 font-medium">Host ID: {hostId.substring(0, 8)}</p>
            </div>

            <Button 
                variant='neon' 
                className="w-full mt-auto text-xs font-bold py-2 h-9 rounded-xl shadow-md transition-transform duration-200 active:scale-98" 
                onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/room/${roomId}`)
                }}
            >
                Join Room
            </Button>
        </div>
    )
}

export default RoomCard
