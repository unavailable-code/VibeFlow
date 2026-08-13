import { db } from "./db"

export async function getRooms(userId?: string){
    try{
        const room = await db.room.findMany({
            where: {
                isActive: true,
                OR: [
                    { visibility: "public" },
                    ...(userId ? [
                        { hostId: userId },
                        {
                            invitations: {
                                some: {
                                    invitedId: userId
                                }
                            }
                        }
                    ] : [])
                ]
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return room
    }
    catch(e){
        console.log(e)
        throw new Error(`Internal Error ${e}`)
    }
}

export async function getRoomByRoomId(id:string){
    try{
        const room=await db.room.findUnique({
            where:{
                id,
            }
        })
        return room
    }
    catch(e){
        console.log(e)
        throw new Error("Cant find room")
    }
}