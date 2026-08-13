import { db } from "./db"

const getPlaylistByUserId=async(id:string)=>{
    const playlist=await db.playlist.findMany({
        where:{
            userId:id,  
        },
        include:{
            songs:true
        }
    })
    return playlist
}

export const makePlaylist=async(name: string,userId: string)=>{
    try{

        const createPlaylist= await db.playlist.create({
            data:{
                userId,
                name
            }
        })
        if(createPlaylist){
            return true
        }
        else{
            return false
        }
    }
    catch(e){
        console.log("Error")
        return false
    }
}

export default getPlaylistByUserId