"use client";

import { Button } from "@/components/ui/button";
import { Companion, Message } from "@prisma/client";
import { ChevronLeft, Edit, MessagesSquare, MoreVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { BotAvatar } from "./BotAvatar";
import { useUser } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useToast } from "./ui/use-toast";
import axios from "axios";

interface ChatHeaderProps {
    companion: Companion & {
        messages: Message[];
        _count: {
            messages: number
        }
    }
}

const ChatHeader = ({ companion }: ChatHeaderProps) => {
    const router = useRouter();
    const { user } = useUser();
    const { toast } = useToast();

    const onDelete = async () => {
        try {
            await axios.delete(`/api/companions/${companion.id}`);
            toast({
                description: "successfully deleted",
            });
            router.refresh();
            router.push("/");
        } catch (error) {
            toast({
                description: "something went wrong",
                variant: "destructive",
            })
        }
    }


    return (
        <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
            <div className="flex gap-x-2 items-center">
                <Button size="icon" variant="ghost" onClick={() => { router.back() }}>
                    <ChevronLeft className="h-8 w-8" />
                </Button>
                <BotAvatar src={companion.src} />
                <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-x-2">
                        <p>
                            {companion.name}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <MessagesSquare className="h-3 w-3 mr-1" />
                            {companion._count.messages}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Created by {companion.username}
                    </p>
                </div>
            </div>
            {user?.id === companion.userId && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="secondary">
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black rounded-md">
                        <DropdownMenuItem onClick={() => router.push(`/companion/${companion.id}`)} className="w-24 cursor-pointer focus:bg-black hover:bg-black">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete} className="w-24 cursor-pointer hover:bg-red-500/80 focus:bg-red-500/80">
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
}

export default ChatHeader;