import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, seed, categoryId, instructions } = body;

        if (!params.id) {
            return new NextResponse("id is required", { status: 400 });
        }

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

        const companion = await prismadb.companion.update({
            where: {
                id: params.id,
            },
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
        return new NextResponse("internal error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", {
                status: 401,
            });
        }
        if (!params.id) {
            return new NextResponse("id is required", { status: 400 });
        }
        const companion = await prismadb.companion.delete({
            where: {
                userId,
                id: params.id,
            },
        });
        return NextResponse.json(companion);
    } catch (error) {
        console.log(error);
        return new NextResponse("internal error", { status: 500 });

    }
}