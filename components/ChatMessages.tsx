"use client";

import { Companion } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "./ChatMessage";
import { ElementRef, useEffect, useRef, useState } from "react";

interface ChatMessagesProps {
    companion: Companion;
    isLoading: boolean;
    messages: ChatMessageProps[];
}

export const ChatMessages = ({ companion, isLoading, messages = [] }: ChatMessagesProps) => {
    const [fakeLoading, setFakeLoading] = useState(messages.length === 0 ? true : false);
    const scrollRef = useRef<ElementRef<"div">>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false);
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    return (
        <div className="flex-1 overflow-y-auto pr-4">
            {messages.map((message) => (
                <ChatMessage key={message.content} isLoading={fakeLoading} src={message.src} role={message.role} content={message.content} />
            ))}
            {isLoading && (
                <ChatMessage role="system" src={companion.src} isLoading />
            )}
            <div ref={scrollRef} />
        </div>
    )
}