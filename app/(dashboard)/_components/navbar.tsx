"use client"

import React from "react"
import Search from "./search"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

const Navbar = () => {
    const pathname = usePathname()
    const isRoom = pathname?.startsWith("/room/")

    return (
        <div className="fixed top-0 left-0 md:left-[240px] right-0 h-20 bg-background/85 backdrop-blur-lg border-b border-border flex items-center justify-between px-4 md:px-10 z-30">
            <div className="flex items-center gap-6">
                {/* Visual branding only on mobile */}
                <h1 className="md:hidden text-lg font-black italic bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    VibeFlow
                </h1>
            </div>
            
            <div className="flex-1 flex justify-center max-w-lg mx-auto">
                {!isRoom && <Search />}
            </div>

            <div className="flex items-center gap-4">
                <UserButton
                    appearance={{
                        elements: {
                            userButtonAvatarBox: "w-8 h-8 md:w-9 md:h-9 hover:opacity-80 transition-opacity border border-border/80 shadow-sm",
                        },
                    }}
                />
            </div>
        </div>
    )
}

export default Navbar
