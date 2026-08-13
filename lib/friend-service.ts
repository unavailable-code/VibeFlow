import { db } from "./db"

export async function getFriends(userId: string) {
    const friendships = await db.friendship.findMany({
        where: {
            OR: [{ requesterId: userId }, { receiverId: userId }],
            status: "ACCEPTED",
        },
        include: {
            requester: { select: { id: true, username: true, image: true, clerkId: true } },
            receiver:  { select: { id: true, username: true, image: true, clerkId: true } },
        },
    })
    return friendships.map((f) => {
        const user = f.requesterId === userId ? f.receiver : f.requester
        return {
            ...user,
            friendshipId: f.id
        }
    })
}

export async function getPendingRequests(userId: string) {
    return db.friendship.findMany({
        where: { receiverId: userId, status: "PENDING" },
        include: {
            requester: { select: { id: true, username: true, image: true } },
        },
    })
}

export async function getSentRequests(userId: string) {
    return db.friendship.findMany({
        where: { requesterId: userId, status: "PENDING" },
        include: {
            receiver: { select: { id: true, username: true, image: true } },
        },
    })
}

export async function sendFriendRequest(requesterId: string, receiverId: string) {
    if (requesterId === receiverId) throw new Error("Cannot add yourself")

    const existing = await db.friendship.findFirst({
        where: {
            OR: [
                { requesterId, receiverId },
                { requesterId: receiverId, receiverId: requesterId },
            ],
        },
    })
    if (existing) throw new Error("Request already exists")

    return db.friendship.create({
        data: { requesterId, receiverId },
    })
}

export async function respondToRequest(
    friendshipId: string,
    userId: string,
    action: "accept" | "reject"
) {
    const friendship = await db.friendship.findUnique({ where: { id: friendshipId } })
    if (!friendship || friendship.receiverId !== userId) throw new Error("Not found")

    if (action === "accept") {
        return db.friendship.update({
            where: { id: friendshipId },
            data: { status: "ACCEPTED" },
        })
    } else {
        return db.friendship.delete({ where: { id: friendshipId } })
    }
}

export async function removeFriend(friendshipId: string, userId: string) {
    const friendship = await db.friendship.findUnique({ where: { id: friendshipId } })
    if (!friendship) throw new Error("Not found")
    if (friendship.requesterId !== userId && friendship.receiverId !== userId) {
        throw new Error("Unauthorized")
    }
    return db.friendship.delete({ where: { id: friendshipId } })
}

export async function searchUsers(query: string, currentUserId: string) {
    return db.user.findMany({
        where: {
            username: { contains: query, mode: "insensitive" },
            id: { not: currentUserId },
        },
        select: { id: true, username: true, image: true },
        take: 10,
    })
}
