export async function getLyric(track:string,artistName:string){
    try{
    const query=track+" "+artistName
    const search=await fetch(`https://lrclib.net/api/search?q=${query}`)
    if(!search.ok){
        throw new Error(search.statusText)
    }
    const res=await search.json()
    const plainLyrics=res[0].plainLyrics
    const syncedLyrics=res[0].syncedLyrics

    return {plainLyrics,syncedLyrics}
    }
    catch(e){
        console.log(e)
        return {}
    }   
}