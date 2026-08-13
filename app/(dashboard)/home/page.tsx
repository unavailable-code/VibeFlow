import { getArtist, getAlbums } from '@/lib/artist-services'
import { getSelf, handleUser } from '@/lib/auth-service'
import ArtistCard from '../_components/artist-card'
import AlbumCard from '../_components/album-card'
import { getSongs } from '@/lib/song-service'
import SongList from '../_components/song-section'
import { redirect } from 'next/navigation'

export const dynamic = "force-dynamic"

const Page = async () => {
    let self
    try {
        await handleUser()
        self = await getSelf()
    } catch {
        redirect("/sign-in")
    }

    try {
        const artists = await getArtist()
        const albums = await getAlbums()
        const songs = await getSongs()

        return (
            <div className="pt-24 px-4 md:px-10 pb-32 md:pl-[280px] min-h-screen">
                <div className="flex items-baseline gap-3 mb-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#1E1B2E]">Welcome Back,</h1>
                    <span className="text-5xl md:text-6xl font-extrabold text-[#7C5CFC] ">
                        {self.username}
                    </span>
                </div>

                <section className="mb-15">
                    <h2 className="text-3xl font-bold text-zinc-400 mb-6">
                        Discover Artists
                    </h2>
                    <div className="max-w-[1200px]">
                        <ArtistCard artists={artists} />
                    </div>
                </section>

                <section className="mb-15">
                    <h2 className="text-3xl font-bold text-zinc-500 mb-6">
                        Trending Albums
                    </h2>
                    <div className="flex gap-6 overflow-x-auto pb-4">
                        {albums.map((album) => (
                            <AlbumCard key={album.id} image={album.image} name={album.name} artist={album.artist} />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-3xl font-bold text-zinc-500 mb-2">
                        Recommended Tracks
                    </h2>
                    <SongList songs={songs} />
                </section>
            </div>
        )
    } catch (error) {
        console.error(error)
        return (
            <div className="pt-24 px-4 md:px-10 pb-32 md:pl-[280px] text-white">
                <h1 className="text-2xl font-bold">Something went wrong loading your dashboard.</h1>
            </div>
        )
    }
}

export default Page

