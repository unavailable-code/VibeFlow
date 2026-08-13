import { db } from "@/lib/db";
import { downloadSong } from "@/utils/download";
import { getMetadata } from "@/utils/metadata";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { song } = await req.json();
        const download=await downloadSong(song)
        const output=await getMetadata(song)
        const rawAlbum=output.album
        const isSingle=rawAlbum.toLowerCase().includes(`${output.title.toLowerCase()} - single`)
        const albumName=isSingle ? `${output.artists[0]} - Singles` : rawAlbum
        if (!output) {
            return NextResponse.json(
                { error: output },
                { status: 400 }
            );
        }
        const artistRecords = await Promise.all(
      output.artistDetails.map(async (artist: any) => {
        return db.artist.upsert({
        where: { name: artist.name },
        update: {},
        create: {
            name: artist.name,
            bio: artist.bio || "",
            image: artist.image || "",
            hasRealImage: artist.hasRealImage,
        },
});
    }
)
        )
    
        const album= await db.album.upsert({
            where:{
                name_artistId:{
                    name:albumName,
                    artistId:artistRecords[0].id,
                },
            
            },
            update:{},
            create:{
                name:albumName,
                artistId: artistRecords[0].id,
                image: output.image
            }
        })

    const createdSongs=await db.song.create({
        data:{
            title:output.title,
            fileName: download.fileName || "",
            duration: download.duration || 0,
            image: output.image,
            plainLyrics: output.plainlyrics || "",
            syncedLyrics:output.syncedLyrics || "",
            albumId:album.id,
            artists:{
                create: artistRecords.map((artist)=>({
                    artistId:artist.id
                }))
            }
        },
        include:{
            artists:true
        }
    })
        
        return NextResponse.json({ data:createdSongs });
    } 
    catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: String(e) },
            { status: 500 }
        );
    }
}
      // 2. Get token
        // const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded",
        //         "Authorization": "Basic " + btoa(client_id + ":" + client_secret)
        //     },
        //     body: "grant_type=client_credentials"
        // })

        // // 3. Guard: check token response
        // if (!tokenRes.ok) {
        //     const tokenError = await tokenRes.text()
        //     console.error("Token error:", tokenError)
        //     return NextResponse.json({ error: "Failed to get Spotify token", detail: tokenError }, { status: 401 })
        // }

        // const token = await tokenRes.json()

        // // 4. Search track
        // const searchRes = await fetch(
        //     `https://api.spotify.com/v1/search?q=${encodeURIComponent(song.trim())}&type=track&limit=1`,
        //     {
        //         method: "GET",
        //         headers: {
        //             "Authorization": `Bearer ${token.access_token}`
        //         }
        //     }
        // )

        // // 5. Guard: check search response
        // if (!searchRes.ok) {
        //     const searchError = await searchRes.text()
        //     console.error("Search error:", searchError)
        //     return NextResponse.json({ error: "Spotify search failed", detail: searchError }, { status: searchRes.status })
        // }

        // const output = await searchRes.json()

        // // 6. Guard: check if any tracks were returned
        // if (!output.tracks?.items?.length) {
        //     return NextResponse.json({ error: "No tracks found" }, { status: 404 })
        // }

        // const track = output.tracks.items[0]

        // return NextResponse.json({
        //     title: track.name,
        //     artist: track.artists[0].name,
        //     album: track.album.name,
        //     image: track.album.images[0]?.url ?? null,
        //     preview_url: track.preview_url,
        // })

