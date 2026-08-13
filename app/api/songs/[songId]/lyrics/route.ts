import { getSelf } from "@/lib/auth-service"
import { getSongById } from "@/lib/song-service"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ songId: string }> }
) {
    try {
        const { songId } = await params
        const song = await getSongById(songId)
        if (!song) return NextResponse.json({ error: "Song not found" }, { status: 404 })
        return NextResponse.json({
            plainLyrics: song.plainLyrics,
            syncedLyrics: song.syncedLyrics,
        })
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}
