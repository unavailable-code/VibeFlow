import { getRoomByRoomId } from "@/lib/room-service"
import RoomClient from "../../_components/room-client"
import { getSongs } from "@/lib/song-service"
import { getSelf } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

const Page = async ({ params }: { params: Promise<{ roomId: string }> }) => {
    const { roomId } = await params
    let user
    try {
        user = await getSelf()
    } catch {
        redirect("/sign-in")
    }

    const room = await getRoomByRoomId(roomId)
    if (!room || !room.isActive) {
        redirect("/listening-rooms")
    }

    // Access control for invite-only rooms
    if (room.visibility === "invite") {
        if (room.hostId !== user.id) {
            const invitation = await db.roomInvitation.findFirst({
                where: {
                    roomId: room.id,
                    invitedId: user.id,
                    status: { in: ["pending", "accepted"] }
                }
            })
            if (!invitation) {
                redirect("/listening-rooms")
            }
        }
    }

    const songs = await getSongs()

    return (
        <div className="pt-24 px-4 md:px-10 pb-32 md:pl-[280px] min-h-screen text-white flex flex-col">
            <RoomClient room={room} songs={songs} user={user} />
        </div>
    )
}

export default Page
