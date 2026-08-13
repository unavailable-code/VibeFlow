import path from "path";
import { YtDlp } from "ytdlp-nodejs";
import B2 from 'backblaze-b2'
import fs from "fs"

export async function downloadSong(song: string){
    try{
        if(!song){
            throw new Error("Enter song name and artist name")
        }
        const ytdlp = new YtDlp()
        console.log("Song=",song);
        song=song+" lyrics"
        const searchResult = await ytdlp.getInfoAsync(`ytsearch1:${song}`) as any
        
        if(!searchResult || !searchResult.entries || searchResult.entries.length === 0){
            throw new Error("No song found")
        }
        const video = searchResult.entries[0]
        const duration = video.duration
        const url = video.url
        console.log(url)
        const fileName = video.id+".mp3"
        const filePath = path.join(process.cwd(),"downloads",fileName)
        await ytdlp.downloadAsync(url,{
            format:{filter:'audioonly',type:'mp3'},
            output:filePath,
        })
        console.log("Downloaded")

        const b2= new B2({
            applicationKey:process.env.B2_APPLICATION_KEY!,
            applicationKeyId:process.env.B2_KEY_ID!
        })
        
        await b2.authorize()
        const uploaderResponse=await b2.getUploadUrl({
            bucketId:process.env.B2_BUCKET_ID!
        })
        const {uploadUrl,authorizationToken}= uploaderResponse.data
        
        const fileData=fs.readFileSync(filePath)
        const uploadResponse=await b2.uploadFile({
            uploadUrl,
            uploadAuthToken:authorizationToken,
            fileName,
            data: fileData
        })
        console.log(uploadResponse.data)
        console.log("Uploaded")
        fs.unlinkSync(filePath)

        return {fileName,duration}
    }
    catch(e){
        console.error(e)
        return {error: String(e)}
    }
}