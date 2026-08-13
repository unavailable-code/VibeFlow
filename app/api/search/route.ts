import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const q = searchParams.get("q")

        if (!q || !q.trim()) {
            return NextResponse.json({ songs: [] })
        }

        const songs = await db.song.findMany({
            where: {
                OR: [
                    { title: { contains: q, mode: "insensitive" } },
                    {
                        artists: {
                            some: {
                                artist: {
                                    name: { contains: q, mode: "insensitive" }
                                }
                            }
                        }
                    },
                    {
                        album: {
                            name: { contains: q, mode: "insensitive" }
                        }
                    }
                ]
            },
            include: {
                artists: { include: { artist: true } },
                album: true,
            },
            take: 15,
        })

        return NextResponse.json({ songs })
    } catch (e) {
        return NextResponse.json({ error: `${e}` }, { status: 500 })
    }
}
