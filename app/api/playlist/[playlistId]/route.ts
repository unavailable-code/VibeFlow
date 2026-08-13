import { getSelf } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ playlistId: string }> }
) {
    try {
        const user = await getSelf()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { playlistId } = await context.params

        // First check if the playlist belongs to the user
        const playlist = await db.playlist.findUnique({
            where: { id: playlistId }
        })

        if (!playlist) {
            return NextResponse.json({ error: "Playlist not found" }, { status: 404 })
        }

        if (playlist.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 })
        }

        // Delete all songs in the playlist first
        await db.playlistSong.deleteMany({
            where: { playlistId }
        })

        // Now delete the playlist itself
        await db.playlist.delete({
            where: { id: playlistId }
        })

        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: `${e}` }, { status: 500 })
    }
}
