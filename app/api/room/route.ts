import { getSelf } from "@/lib/auth-service"
import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest){
    try{
        const body = await request.json()
        const user = await getSelf()

        if(!user){
            return NextResponse.json({ msg:"Unauthorized" }, { status:401 })
        }
        if(!body.name){
            return NextResponse.json({ error:"Room name required" }, { status:400 })
        }

        const visibility = ["public", "friends", "invite"].includes(body.visibility)
            ? body.visibility
            : "public"

        const room = await db.room.create({
            data:{
                name: body.name,
                visibility,
                hostId: user.id,
            }
        })
        return NextResponse.json(room)
    }
    catch(e){
        console.log(e)
        return NextResponse.json({ error: `Something went wrong ${e}` }, { status:500 })
    }
}

export async function GET(request: NextRequest){
    try{
        const user = await getSelf()
        const { searchParams } = new URL(request.url)
        const roomId = searchParams.get("roomId")

        if(!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        if(!roomId) return NextResponse.json({ error: "roomId required" }, { status: 400 })

        const invitation = await db.roomInvitation.findFirst({
            where: { roomId, invitedId: user.id, status: "pending" }
        })

        return NextResponse.json({ hasInvite: !!invitation })
    } catch(e){
        return NextResponse.json({ error: `${e}` }, { status: 500 })
    }
}
