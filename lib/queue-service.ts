import { db } from "./db"

export async function getOrCreateQueue(userId: string) {
    let queue = await db.queue.findUnique({
        where: { userId },
        include: {
            songs: {
                orderBy: { position: "asc" },
                include: { song: true },
            },
        },
    })
    if (!queue) {
        queue = await db.queue.create({
            data: { userId },
            include: {
                songs: {
                    orderBy: { position: "asc" },
                    include: { song: true },
                },
            },
        })
    }
    return queue
}

export async function addSongToQueue(userId: string, songId: string) {
    const queue = await getOrCreateQueue(userId)
    const maxPos = queue.songs.length > 0
        ? Math.max(...queue.songs.map((s) => s.position))
        : -1

    return db.queueSong.create({
        data: {
            queueId: queue.id,
            songId,
            position: maxPos + 1,
        },
        include: { song: true },
    })
}

export async function removeFromQueue(queueSongId: string, userId: string) {
    const queue = await db.queue.findUnique({ where: { userId } })
    if (!queue) throw new Error("Queue not found")
    const item = await db.queueSong.findUnique({ where: { id: queueSongId } })
    if (!item || item.queueId !== queue.id) throw new Error("Not found")
    return db.queueSong.delete({ where: { id: queueSongId } })
}

export async function clearQueue(userId: string) {
    const queue = await db.queue.findUnique({ where: { userId } })
    if (!queue) return
    return db.queueSong.deleteMany({ where: { queueId: queue.id } })
}
