// app/api/playlist/[playlistId]/songs/route.ts

import { getSelf } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
    req: Request,
    context: {
        params: Promise<{
            playlistId: string
        }>
    }
) {
    try {
        const { playlistId } = await context.params

        const playlist = await db.playlist.findUnique({
            where: { id: playlistId },
            include: {
                songs: {
                    orderBy: { position: "asc" },
                    include: {
                        song: {
                            include: { artists: { include: { artist: true } } },
                        },
                    },
                },
            },
        })

        const discoverSongs = await db.song.findMany({
            where: {
                NOT: {
                    playlistSongs: { some: { playlistId } },
                },
            },
            include: { artists: { include: { artist: true } } },
            take: 15,
        })

        return NextResponse.json({
            playlistSongs: playlist?.songs || [],
            discoverSongs,
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json({ error: "Failed" }, { status: 500 })
    }
}

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ playlistId: string }> }
) {
    try {
        const user = await getSelf()
        const { playlistId } = await context.params
        const { songId } = await req.json()
        if (!songId) return NextResponse.json({ error: "songId required" }, { status: 400 })

        const playlist = await db.playlist.findUnique({ where: { id: playlistId } })
        if (!playlist || playlist.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const maxPos = await db.playlistSong.count({ where: { playlistId } })
        const song = await db.song.findUnique({ where: { id: songId }, select: { title: true } })
        if (!song) return NextResponse.json({ error: "Song not found" }, { status: 404 })

        const item = await db.playlistSong.create({
            data: { playlistId, songId, name: song.title, position: maxPos },
            include: { song: { include: { artists: { include: { artist: true } } } } },
        })
        return NextResponse.json(item)
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ playlistId: string }> }
) {
    try {
        const user = await getSelf()
        const { playlistId } = await context.params
        const { searchParams } = new URL(req.url)
        const playlistSongId = searchParams.get("playlistSongId")
        if (!playlistSongId) return NextResponse.json({ error: "playlistSongId required" }, { status: 400 })

        const playlist = await db.playlist.findUnique({ where: { id: playlistId } })
        if (!playlist || playlist.userId !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        await db.playlistSong.delete({ where: { id: playlistSongId } })
        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}