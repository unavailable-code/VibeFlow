import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try{
        const body=await request.json()
        const createPlaylist= await db.playlist.create({
            data:{
                userId:body.userId,
                name:body.name
            }
        })
        if(createPlaylist){
            return NextResponse.json({msg:"Created Playlist"},{status:200})
        }
        else{
            return NextResponse.json({msg:"Somethings off"},{status:400})
        }
    }
    catch(e){
        console.log("Error")
        return NextResponse.json({error : `${e}`},{status:500})
    }
}
