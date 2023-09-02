import prismadb from "@/lib/prismadb";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, seed, categoryId, instructions } = body;

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", {
                status: 401,
            });
        }
        if (!src || !name || !description || !seed || !categoryId || !instructions) {
            return new NextResponse("Bad Request", {
                status: 400,
            });
        }

        const companion = await prismadb.companion.create({
            data: {
                categoryId,
                userId: user.id,
                username: user.firstName,
                src,
                name,
                description,
                seed,
                instructions,
            }
        });

        return NextResponse.json(companion);

    } catch (error) {
        console.error(error);
        return new NextResponse("iternal error", { status: 500 });
    }
}