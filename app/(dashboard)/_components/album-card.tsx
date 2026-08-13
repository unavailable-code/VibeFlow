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
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md border border-border group-hover:shadow-primary/10 group-hover:border-primary/20 transition-all duration-300">
                <img 
                    src={image} 
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Interactive Play Hover Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-lg transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:scale-105 active:scale-95">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-white">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>
            </div>
            
            {/* Meta Text */}
            <div className="mt-3.5 space-y-0.5 px-0.5">
                <p className="font-bold text-foreground text-sm md:text-base truncate group-hover:text-primary transition-colors duration-200">{name}</p>
                <p className="text-muted-foreground text-xs md:text-sm font-medium truncate">{artist.name}</p>
            </div>  
        </div>
    )
}

export default AlbumCard
