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
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white font-bold text-sm shadow-md shadow-primary/10 active:scale-[0.98] transition-all duration-200 mb-8 cursor-pointer border-none"
            >
                <Plus size={16} strokeWidth={2.5} />
                Create Room
            </button>

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.length === 0 ? (
                    <div className="text-muted-foreground/40 text-center col-span-full py-24 bg-card rounded-2xl border border-border p-6 shadow-sm">
                        <p className="text-base font-bold text-foreground">No active rooms right now</p>
                        <p className="text-xs mt-1 font-medium text-muted-foreground">Create a session and start listening with friends!</p>
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
