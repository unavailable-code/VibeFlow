"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface itemProps{
    icon: LucideIcon,
    label: string,
    href: string,
    isActive: boolean
}
const Items = ({
    icon: Icon,
    label,
    href,
    isActive
}:itemProps) => {
    return (
        <div >
            <Button
            asChild
            className={cn("w-full h-15 hover:bg-gray-800 bg-transparent cursor-pointer justify-start pl-6 text-white ",isActive &&"bg-cyan-400 hover:bg-cyan-400 text-black")}>      
            <div className="flex flex-row w-full ">
                <Link href={href} className="flex  text-left">
                <p className="text-lg flex items-center gap-3" >   
                <Icon />
                    {label}
                    </p>
                </Link>
                </div>                                         
            </Button>
        </div>
    );
}

export default Items;
