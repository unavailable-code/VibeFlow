"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import RoomCard from "./room-card"
import CreateRoomDialog from "./create-room-dialog"

interface ListeningRoomsClientProps {
    rooms: any[]
    friends: any[]
}

export default function ListeningRoomsClient({ rooms, friends }: ListeningRoomsClientProps) {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <div>
            {/* Create Room Button */}
            <button
                onClick={() => setDialogOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-bold text-sm shadow-[0_4px_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] hover:shadow-[0_4px_24px_rgba(168,85,247,0.4)] active:scale-[0.98] transition-all duration-200 mb-8"
            >
                <Plus size={16} strokeWidth={2.5} />
                Create Room
            </button>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.length === 0 ? (
                    <div className="text-white/30 text-center col-span-full py-24 bg-white/[0.01] rounded-2xl border border-white/[0.04] p-6">
                        <p className="text-base font-semibold">No active rooms right now</p>
                        <p className="text-xs mt-1 font-medium">Create a session and start listening with friends!</p>
                    </div>
                ) : (
                    rooms.map((room) => (
                        <RoomCard
                            key={room.id}
                            name={room.name}
                            hostId={room.hostId}
                            roomId={room.id}
                            visibility={room.visibility}
                        />
                    ))
                )}
            </div>

            <CreateRoomDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                friends={friends}
            />
        </div>
    )
}
