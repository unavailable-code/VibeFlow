import { getSelf } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        const user = await getSelf()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { roomId, friendId } = await request.json()
        if (!roomId || !friendId) {
            return NextResponse.json({ error: "roomId and friendId required" }, { status: 400 })
        }

        // Verify this user is the host
        const room = await db.room.findUnique({ where: { id: roomId } })
        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })
        if (room.hostId !== user.id) {
            return NextResponse.json({ error: "Only the host can invite" }, { status: 403 })
        }

        // Upsert the invitation
        const invite = await db.roomInvitation.upsert({
            where: { id: `${roomId}-${friendId}` },
            update: { status: "pending" },
            create: {
                roomId,
                invitedId: friendId,
                hostId: user.id,
                status: "pending",
            }
        })

        return NextResponse.json(invite)
    } catch (e) {
        return NextResponse.json({ error: `${e}` }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const user = await getSelf()
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        const { inviteId, action } = await request.json()
        if (!inviteId || !action) {
            return NextResponse.json({ error: "inviteId and action required" }, { status: 400 })
        }

        const invite = await db.roomInvitation.update({
            where: { id: inviteId, invitedId: user.id },
            data: { status: action === "accept" ? "accepted" : "rejected" }
        })
        return NextResponse.json(invite)
    } catch (e) {
        return NextResponse.json({ error: `${e}` }, { status: 500 })
    }
}
