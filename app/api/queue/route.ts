import { getSelf } from "@/lib/auth-service"
import { addSongToQueue, clearQueue, getOrCreateQueue } from "@/lib/queue-service"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        const user = await getSelf()
        const queue = await getOrCreateQueue(user.id)
        return NextResponse.json(queue)
    } catch (e) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getSelf()
        const { songId } = await req.json()
        if (!songId) return NextResponse.json({ error: "songId required" }, { status: 400 })
        const item = await addSongToQueue(user.id, songId)
        return NextResponse.json(item)
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}

export async function DELETE() {
    try {
        const user = await getSelf()
        await clearQueue(user.id)
        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}
