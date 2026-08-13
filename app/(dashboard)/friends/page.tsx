import { getSelf } from "@/lib/auth-service"
import { redirect } from "next/navigation"
import FriendsClient from "../_components/friends-client"

export const dynamic = "force-dynamic"

export default async function FriendsPage() {
    let user
    try {
        user = await getSelf()
    } catch {
        redirect("/sign-in")
    }

    return (
        <div className="pt-24 px-4 md:px-10 pb-32 md:pl-[280px] min-h-screen text-white">
            <div className="mb-10">
                <h1 className="text-5xl font-extrabold mb-2">
                    Social Hub
                </h1>
                <p className="text-white/60 text-lg">
                    Manage your friends and send live music room requests.
                </p>
            </div>

            <FriendsClient currentUser={user} />
        </div>
    )
}
