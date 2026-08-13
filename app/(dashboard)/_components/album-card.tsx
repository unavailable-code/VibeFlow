type Artist = {
     name: string
     image: string 
     id: string 
     bio: string 
     hasRealImage: boolean
}

interface albumCardProps {
    name: string
    artist: Artist
    image: string
}

const AlbumCard = ({ name, artist, image }: albumCardProps) => {
    return (
        <div className="group flex-shrink-0 w-[150px] md:w-[180px] cursor-pointer transition-all duration-300">
            {/* Artwork Container */}
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4)] border border-white/5 group-hover:shadow-purple-500/10 group-hover:border-white/10 transition-all duration-300">
                <img 
                    src={image} 
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Interactive Play Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>
            
            {/* Meta Text */}
            <div className="mt-3.5 space-y-0.5 px-0.5">
                <p className="font-bold text-white text-sm md:text-base truncate group-hover:text-purple-400 transition-colors duration-200">{name}</p>
                <p className="text-white/40 text-xs md:text-sm font-medium truncate">{artist.name}</p>
            </div>  
        </div>
    )
}

export default AlbumCard
