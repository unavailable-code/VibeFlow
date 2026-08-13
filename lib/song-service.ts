import { db } from "./db"

export const getSongs = async () => {
    try {
        const songs = await db.song.findMany({
            take: 20,
            include: {
                artists: { include: { artist: true } },
                album: true,
            },
        })
        return songs
    } catch (e) {
        console.log(e)
        return []
    }
}

export const getSongById = async (id: string) => {
    try {
        return await db.song.findUnique({
            where: { id },
            include: {
                artists: { include: { artist: true } },
                album: true,
            },
        })
    } catch (e) {
        console.log(e)
        return null
    }
}

export const getAllSongs = async () => {
    try {
        return await db.song.findMany({
            include: { artists: { include: { artist: true } }, album: true },
            orderBy: { title: "asc" },
        })
    } catch (e) {
        return []
    }
}