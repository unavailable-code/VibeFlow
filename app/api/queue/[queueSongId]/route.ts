import { getSelf } from "@/lib/auth-service"
import { removeFromQueue } from "@/lib/queue-service"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ queueSongId: string }> }
) {
    try {
        const user = await getSelf()
        const { queueSongId } = await params
        await removeFromQueue(queueSongId, user.id)
        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}
