"use client"

import { useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

interface Artist {
  id: string
  name: string
  image: string
  bio: string
}

export default function ArtistCarousel({ artists }: { artists: Artist[] }) {
  const autoplay = useRef(
    Autoplay({
      delay: 7000,
      stopOnInteraction: false,
    })
  )

  return (
    <div className="w-full relative">
        <Carousel
            plugins={[autoplay.current]}
            opts={{ loop: true }}
            className="w-full"
        >
            <CarouselContent>
                {artists.map((artist) => (
                    <CarouselItem key={artist.id}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16 px-4 md:px-8 py-6">
                            {/* Artist Text Info */}
                            <div className="flex flex-col flex-1 order-2 md:order-1 text-center md:text-left gap-y-4 max-w-lg">
                                <span className="text-xs font-bold tracking-widest text-purple-400 uppercase">Featured Artist</span>
                                <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">{artist.name}</h3>
                                <p className="text-sm md:text-base text-white/60 leading-relaxed font-light line-clamp-3 md:line-clamp-4">
                                    {artist.bio}
                                </p>
                                <div className="pt-2">
                                    <Button variant="neon" className="w-full md:w-auto px-8 h-12 rounded-xl text-sm font-bold tracking-wide transition-transform active:scale-95 shadow-[0_4px_20px_rgba(168,85,247,0.3)]">
                                        Listen Now
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Artist Portrait Image */}
                            <div className="w-full max-w-[280px] md:max-w-[360px] aspect-square rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 order-1 md:order-2 shrink-0 group relative">
                                <img 
                                    src={artist.image} 
                                    alt={artist.name} 
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                            </div>
                        </div> 
                    </CarouselItem>
                ))}
            </CarouselContent>
            
            {/* Desktop Navigation Controls */}
            <div className="hidden md:block">
                <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-[#0d0d16]/80 border-white/5 hover:bg-purple-600 hover:text-white transition-all w-10 h-10" />
                <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-[#0d0d16]/80 border-white/5 hover:bg-purple-600 hover:text-white transition-all w-10 h-10" />
            </div>
        </Carousel>
    </div>
  )
}