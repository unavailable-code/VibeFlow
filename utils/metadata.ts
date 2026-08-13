import { getLyric } from "./getLyrics";

type MetadataOutput = {
  title: string;
  artists: string[];
  album: string;
  image: string;
  artistDetails: {
    name: string;
    image: string | null;
    bio: string | null;
  }[];
  plainlyrics: string;
  syncedLyrics: string;
};
export async function getMetadata(song: string):Promise<MetadataOutput>{
    try{
    if (!song) {
                throw new Error("No song found")
            }
    
            // Fetch track from iTunes
            const search = await fetch(
                `https://itunes.apple.com/search?term=${encodeURIComponent(song)}&entity=song&limit=10`,
                {
                headers:{
                     "User-Agent": "Mozilla/5.0",
                    "Accept": "application/json"
                }
            }
            );
        

            const text = await search.text();
            const cleanText = text.trim();
            let data;

            try {
                data = JSON.parse(cleanText);
                } catch (err) {
                console.log("iTunes RAW:", text);
                throw new Error("Invalid JSON from iTunes");
                }
            function bestSong(track:any){
                const q=song.toLowerCase()
                const title=track.trackName?.toLowerCase() || ""
                const artist=track.artistName?.toLowerCase() || ""
                const album=track.collectionName?.toLowerCase() || ""
                let score=0
                if(title.includes(q)) score+=5
                if(artist.includes(q)) score+=3
    
                if(title.includes("remix")) score-=2
                if(title.includes("live")) score-=2
                if(title.includes("karaoke")) score-=2
                if(album.includes("in style")) score-=1
    
                return score
            }
            const results=data.results
            if(!results.length){
                throw new Error("No results found")
            }
            const bestTrack=results.map((t:any)=>({
                track:t,
                score: bestSong(t)
            }))
            .sort((a:any,b:any)=>b.score-a.score)[0].track
            const track = bestTrack
    
            if (!track) {
                throw new Error("No valid track found")
            }
    
            // Extract multiple artists
            const artists: string[] = track.artistName
                .split(/,|&|feat\.?|ft\.?/i)
                .map((a: string) => a.trim())
                .filter(Boolean);
    
            const fallbackImage = track.artworkUrl100.replace("100x100", "500x500");
    
            //  Fetch artist details from Wikipedia
            const artistDetails = [];
    
            for (const artist of artists) {
        let image: string | null = null;
        let bio: string | null = null;
    
        let hasRealImage=true
        try {
            const searchRes = await fetch(
                `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(artist + " musician")}&format=json&origin=*`
            );
            const searchData = await searchRes.json();
            const pageTitle = searchData.query?.search?.[0]?.title;
    
            if (pageTitle) {
                const wikiRes = await fetch(
                    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle).replace(/%20/g, "_")}`
                );
                const wikiData = await wikiRes.json();
    
                image = wikiData.thumbnail?.source ?? fallbackImage;
                if(image==fallbackImage) hasRealImage=false
                bio = wikiData.extract
                    ? wikiData.extract.slice(0, 400) + "..."
                    : null;
            } else {
                image = fallbackImage;
            }
            
        } catch (err) {
            console.log("Wiki error:", err);
            image = fallbackImage;
            hasRealImage=false
            bio = null;
        }
        
        artistDetails.push({ name: artist, image, bio , hasRealImage });
    }
    
    // Final output
    const {plainLyrics,syncedLyrics}=await getLyric(track.trackName,artists[0])
            const output = {
                title: track.trackName,
                artists,
                album: track.collectionName,
                image: fallbackImage,
                artistDetails,
                plainlyrics:plainLyrics,
                syncedLyrics:syncedLyrics
            };
    
            return output;
        
        } catch (e) {
            console.error(e);
            return {title: "",
                artists:[],
                album: "",
                image: "",
                artistDetails:[],
                plainlyrics:"",
                syncedLyrics:""}
        }
}