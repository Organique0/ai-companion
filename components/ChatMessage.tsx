import { useTheme } from "next-themes";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import { BotAvatar } from "./BotAvatar";
import { BeatLoader } from "react-spinners";
import { UserAvatar } from "./UserAvatat";
import { Copy } from "lucide-react";
import { Button } from "./ui/button";

export interface ChatMessageProps {
    role: "system" | "user";
    content?: string;
    isLoading?: boolean;
    src?: string;
}

export const ChatMessage = ({ role, content, isLoading, src }: ChatMessageProps) => {
    const { toast } = useToast();
    const { theme } = useTheme();

    const onCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        console.log("Copied to clipboard");
        toast({
            description: "copied to clipboard",
        });
    }

    return (
        <div className={cn('group flex items-start gap-x-3 w-full py-4', role === "user" && 'justify-end')}>
            {role !== "user" && src && (
                <BotAvatar src={src} />
            )}
            <div className="rounded-md px-4 py-2 max-w-sm bg-primary/10 text-sm">
                {isLoading ? <BeatLoader color={theme === "light" ? "black" : "white"} size={9} /> : content}
            </div>
            {role === "user" && (
                <UserAvatar />
            )}
            {role !== "user" && !isLoading && (
                <Button onClick={onCopy} className="opacity-0 group-hover:opacity-100 transition" size="icon" variant="ghost">
                    <Copy size={15} />
                </Button>
            )}
        </div>
    );
}