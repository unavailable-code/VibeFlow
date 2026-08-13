import { getSelf } from "@/lib/auth-service"
import { removeFriend, respondToRequest } from "@/lib/friend-service"
import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ friendshipId: string }> }
) {
    try {
        const user = await getSelf()
        const { friendshipId } = await params
        const { action } = await req.json()
        if (action !== "accept" && action !== "reject") {
            return NextResponse.json({ error: "action must be accept or reject" }, { status: 400 })
        }
        const result = await respondToRequest(friendshipId, user.id, action)
        return NextResponse.json(result ?? { success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 })
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ friendshipId: string }> }
) {
    try {
        const user = await getSelf()
        const { friendshipId } = await params
        await removeFriend(friendshipId, user.id)
        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 })
    }
}
