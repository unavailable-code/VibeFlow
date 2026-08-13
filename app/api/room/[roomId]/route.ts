import { getSelf } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ roomId: string }> }
) {
    try {
        const user = await getSelf()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { roomId } = await context.params
        const { isActive } = await request.json()

        const room = await db.room.findUnique({
            where: { id: roomId }
        })

        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })
        if (room.hostId !== user.id) {
            return NextResponse.json({ error: "Only the host can modify the room" }, { status: 403 })
        }

        const updatedRoom = await db.room.update({
            where: { id: roomId },
            data: { isActive }
        })

        return NextResponse.json(updatedRoom)
    } catch (e) {
        return NextResponse.json({ error: `${e}` }, { status: 500 })
    }
}
