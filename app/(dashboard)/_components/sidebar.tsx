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
            <aside className="hidden md:flex w-[240px] h-screen bg-gradient-to-b from-[#0d0d16] to-[#06060c] border-r border-white/[0.04] fixed top-0 left-0 z-40 flex-col pt-6">
                {/* Logo */}
                <div className="px-6 pb-8">
                    <h1 className="text-2xl font-black italic bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent tracking-tight">
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
                                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                                    isActive 
                                        ? "bg-purple-600/10 text-purple-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-purple-500/20" 
                                        : "text-white/50 hover:bg-white/[0.04] hover:text-white border border-transparent"
                                }`}
                            >
                                <Icon size={18} className={isActive ? "text-purple-400" : "text-white/40"} />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </aside>

            {/* Mobile/Tablet Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#06060c]/95 backdrop-blur-xl border-t border-white/[0.06] z-50 flex justify-around items-center px-2 pb-safe">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors ${
                                isActive ? "text-purple-400" : "text-white/40 hover:text-white/70"
                            }`}
                        >
                            <Icon size={20} className={isActive ? "text-purple-400" : "text-white/40"} />
                            <span className="text-[10px] font-semibold mt-1 tracking-wide">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}

export default Sidebar
