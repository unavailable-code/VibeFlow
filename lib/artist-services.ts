import { db } from "./db"

export const getArtist=async()=>{
    try{
            const artist=await db.artist.findMany({
                where:{
                    hasRealImage:true
                },
                take:7
            })
            return artist
        }
        
        catch (e){
            console.log(e)
            return []
        }
    }

    export const getAlbums=async()=>{
        try{
            const albums=await db.album.findMany({
                take:4,
                where:{
                    NOT:{
                        name:{
                            contains:"Singles",
                            mode: "insensitive"
                        }
                    }
                },
                include:{
                    artist:true
                }
            })
            return albums
        }catch(e){
            return []
        }
    }

    // export const getArtistByArtistId=async()=>{
    //     try{
            
    //     }
    //     catch(e){
    //         return []
    //     }
    // }