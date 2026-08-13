import { redirect } from "next/navigation"
import { getSelf } from "@/lib/auth-service"
import getPlaylistByUserId from "@/lib/playlist-service"
import CreatePlaylistButton from "../_components/create-playlist-button"
import LibraryClient from "../_components/library-client"

export const dynamic = "force-dynamic"

const LibraryPage = async () => {
    let user
    try {
        user = await getSelf()
    } catch {
        redirect("/sign-in")
    }

    const playlists = await getPlaylistByUserId(user.id)

    return (
        <div className="pt-24 px-4 md:px-10 pb-32 md:pl-[280px] min-h-screen text-white">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-5xl font-extrabold text-zinc-500">
                    Your Library
                </h1>
                <CreatePlaylistButton id={user.id} />
            </div>

            {playlists.length === 0 ? (
                <div className="mt-20 text-center text-white/50 text-lg">
                    You haven't created any playlists yet.
                </div>
            ) : (
                <LibraryClient playlists={playlists} />
            )}
        </div>
    )
}

export default LibraryPage