"use client";
import { cn } from "@/lib/utils";
import { Home, Plus, Settings } from "lucide-react"
import { usePathname, useRouter } from "next/navigation";



const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const routes = [
        {
            icon: Home,
            href: "/",
            label: "home",
            pro: false,
        },
        {
            icon: Plus,
            href: "/companion/new",
            label: "create",
            pro: true,
        },
        {
            icon: Settings,
            href: "/settings",
            label: "settings",
            pro: false,
        },
    ]

    const onNavigate = (url: string, pro: boolean) => {
        return router.push(url);
    }
    return (
        <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
            <div className="justify-center flex flex-1 p-3">
                <div className="space-y-2">
                    {routes.map((r) => (
                        <div
                            onClick={() => onNavigate(r.href, r.pro)}
                            key={r.href}
                            className={cn(`
                            text-muted-foreground 
                            text-xs 
                            group 
                            flex 
                            p-3
                             w-full 
                             justify-start 
                             font-medium 
                             cursor-pointer 
                             hover:text-primary 
                             hover:bg-primary/10 
                             rounded-lg 
                             transition`,
                                pathname === r.href && "bg-primary/10")
                            }>
                            <div className="flex flex-col gap-y-2 items-center flex-1">
                                <r.icon className="h-5 w-5" />
                                {r.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Sidebar;