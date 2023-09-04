import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import { ChatClient } from "./components/client";

interface ChatIdPageProps {
    params: {
        id: string
    }
}

const page = async ({ params }: ChatIdPageProps) => {
    const { userId } = auth();
    if (!userId) return redirectToSignIn();
    const companion = await prismadb.companion.findUnique({
        where: {
            id: params.id
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                where: {
                    userId
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    });

    if (!companion) return redirect("/");

    return (
        <ChatClient companion={companion} />
    )
}

export default page