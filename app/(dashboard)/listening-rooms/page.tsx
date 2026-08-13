import { getSelf } from "@/lib/auth-service"
import { getFriends } from "@/lib/friend-service"
import { getRooms } from "@/lib/room-service"
import ListeningRoomsClient from "../_components/listening-rooms-client"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

const Page = async () => {
    let user
    try {
        user = await getSelf()
    } catch {
        redirect("/sign-in")
    }

    const rooms = await getRooms(user.id)
    const friends = await getFriends(user.id).catch(() => [])
    
    return (
        <div className="pt-24 px-4 md:px-10 pb-32 md:pl-[280px] min-h-screen text-white">
            <div className="mb-8">
                <h1 className="text-5xl font-extrabold text-zinc-500">
                    Join a room.
             
                </h1>
                <p className="text-black/25 text-lg mt-4">
                    {rooms.length === 0 ? "No active rooms right now. Create one to start vibing!" : "Discover active rooms"}
                </p>
            </div>

            <ListeningRoomsClient rooms={rooms} friends={friends} />
        </div>
    )
}

export default Page

