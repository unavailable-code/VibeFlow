import { getSelf } from "@/lib/auth-service"
import {
    getFriends,
    getPendingRequests,
    getSentRequests,
    searchUsers,
    sendFriendRequest,
} from "@/lib/friend-service"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const user = await getSelf()
        const { searchParams } = new URL(req.url)
        const query = searchParams.get("search")

        if (query) {
            const results = await searchUsers(query, user.id)
            return NextResponse.json({ users: results })
        }

        const [friends, pending, sent] = await Promise.all([
            getFriends(user.id),
            getPendingRequests(user.id),
            getSentRequests(user.id),
        ])
        return NextResponse.json({ friends, pending, sent })
    } catch (e) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getSelf()
        const { receiverUsername } = await req.json()
        if (!receiverUsername) {
            return NextResponse.json({ error: "receiverUsername required" }, { status: 400 })
        }
        const receiver = await db.user.findUnique({ where: { username: receiverUsername } })
        if (!receiver) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }
        const friendship = await sendFriendRequest(user.id, receiver.id)
        return NextResponse.json(friendship)
    } catch (e: any) {
        return NextResponse.json({ error: e.message || String(e) }, { status: 400 })
    }
}
