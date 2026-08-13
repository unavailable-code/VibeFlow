"use client"

import { Home, Music2, Users, UserPlus2 } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navItems = [
    { label: "Home",            href: "/home",            icon: Home },
    { label: "Library",         href: "/library",         icon: Music2 },
    { label: "Listening Rooms", href: "/listening-rooms", icon: Users },
    { label: "Friends",         href: "/friends",         icon: UserPlus2 },
]

const Sidebar = () => {
    const pathname = usePathname()

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-[240px] h-screen bg-card border-r border-border fixed top-0 left-0 z-40 flex-col pt-6 shadow-sm">
                {/* Logo */}
                <div className="px-6 pb-8">
                    <h1 className="text-2xl font-black text-[#1E1B2E]">
                        VibeFlow
                    </h1>
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 px-4 space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-12 font-medium ${
                                    isActive 
                                        ? "bg-primary/10 text-primary border border-primary/10 shadow-[0_2px_8px_rgba(124,92,252,0.08)]" 
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground border border-transparent"
                                }`}
                            >
                                <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Mobile/Tablet Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/95 backdrop-blur-xl border-t border-border z-50 flex justify-around items-center px-2 pb-safe shadow-lg">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Icon size={20} className={isActive ? "text-primary" : "text-muted-foreground"} />
                            <span className="text-[10px] font-semibold mt-1 tracking-wide">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}

export default Sidebar
