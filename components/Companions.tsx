import { Companion } from "@prisma/client";
import Image from "next/image";
import { Card, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { Item } from "@radix-ui/react-dropdown-menu";

export interface CompanionsProps {
    data: (Companion & {
        categoryId: string,
        _count?: {
            messages: number,
        },
    })[];
}

const Companions = ({ data }: CompanionsProps) => {
    if (data.length === 0) {
        return (
            <div className="pt-10 flex flex-col justify-center space-y-3 items-center">
                <h5 className="text-sm text-muted-foreground">There were no results found. So here is a nice icon.</h5>
                <div className="relative h-60 w-60">
                    <Image fill className="grayscale" alt="empty" src="empty.svg" />
                </div>
            </div>
        )
    }
    //TODO: Add messages count
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
            {data.map((comp) => (
                <Card key={comp.id} className="bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0">
                    <Link href={`/chat/${comp.id}`}>
                        <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
                            <div className="relative h-32 w-32">
                                <Image fill className="rounded-xl object-cover" alt="companion" src={comp.src} />
                            </div>
                            <p className="font-bold">
                                {comp.name}
                            </p>
                            <p className="text-xs">
                                {comp.description}
                            </p>
                        </CardHeader>
                        <CardFooter className="flex justify-between text-xs text-muted-foreground items-center">
                            <p className="lowecase">
                                @{comp.username}
                            </p>
                            <div className="flex items-center">
                                <MessagesSquare className="h-3 w-3 mr-1" />
                                <p>
                                    {comp._count?.messages}
                                </p>
                            </div>
                        </CardFooter>
                    </Link>
                </Card>
            ))}
        </div>
    );
}

export default Companions;