"use client";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import MobileSidebar from "./MobileSidebar";
import { useEffect, useState } from "react";

const font = Poppins({
    weight: "600",
    subsets: ["latin"],
})

//the worst part about Next.js is present in this file. 
//Why do we need to do this at all? Can't Vercel make it work better?
//Instead, we need to use this useEffect hack everywhere. Otherwise it won't work.

export const Navbar = () => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, [])
    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="flex items-center">
                <MobileSidebar />
                <Link href="/">
                    <h1 className={cn("hidden md:block text-xl md:text-3xl font-bold text-primary", font.className)}>
                        companion.ai
                    </h1>
                </Link>
            </div>
            <div className="flex items-center gap-x-3">
                <Button size="sm" variant="premium">
                    Upgrade
                    <Sparkles className="h-4 w-4 fill-white ml-2" />
                </Button>
                <ModeToggle />
                {mounted && <UserButton afterSignOutUrl="/" />}

            </div>
        </div>
    )
}