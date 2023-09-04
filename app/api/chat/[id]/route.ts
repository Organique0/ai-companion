import { StreamingTextResponse, LangChainStream, streamToResponse } from "ai";
import { auth, currentUser } from "@clerk/nextjs";
import { CallbackManager } from "langchain/callbacks";
import { NextResponse } from "next/server";
import { MemoryManager } from "@/lib/memory";
import { ratelimit } from "@/lib/rate-limit";
import prismadb from "@/lib/prismadb";
import { Replicate } from "langchain/llms/replicate";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const { prompt } = await req.json();
        const user = await currentUser();
        console.log("user loaded");
        if (!user || !user.firstName || !user.id) return new NextResponse("unauthorized", { status: 401 });

        const identifier = req.url + "-" + user.id;
        const { success } = await ratelimit(identifier);
        console.log("ratelimit success");
        if (!success) return new NextResponse("too many requests", { status: 429 });

        const companion = await prismadb.companion.update({
            where: {
                id: params.id,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id,
                    }
                }
            }
        }).catch((err) => { console.log(err) });
        console.log("mongodb updated companion");

        if (!companion) return new NextResponse("companion not found", { status: 404 });

        const name = companion.id;
        const companion_fiel_name = name + ".txt";

        const companionKey = {
            companionName: name,
            userId: user.id,
            modelName: "llama2-13b",
        }

        const memoryManager = await MemoryManager.getInstance();
        console.log("memory manager loaded");

        const records = await memoryManager.readLatestHistory(companionKey);
        console.log("records read");

        if (records.length == 0) {
            await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
            console.log("chat history seeded");
        }

        await memoryManager.addToHistory(companionKey, "User: " + prompt + "\n");
        console.log("chat history updated");

        const recentChatHistory = await memoryManager.readLatestHistory(companionKey);
        console.log("recent chat history read");

        const similarDocs = await memoryManager.vectorSearch(
            recentChatHistory,
            companion_fiel_name
        );
        console.log("similar docs read");

        let relevantHistory = "";

        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map(doc => doc.pageContent).join("\n");
        }

        const { handlers } = LangChainStream();
        const model = new Replicate({
            model: "a16z-infra/llama-2-13b-chat:9dff94b1bed5af738655d4a7cbcdcde2bd503aa85c94334fe1f42af7f3dd5ee3",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        model.verbose = true;

        const res = String(
            await model.call(`
                ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${name}: prefix.
                ${companion.instructions}
                Below are the relevant details about ${name}'s past and the convestaions you are in. ${relevantHistory}
                ${recentChatHistory}\n${name}
            `).catch(console.error)
        );

        const cleaned = res.replaceAll(",", "");
        const chunks = cleaned.split("\n");
        const response = chunks[0];

        await memoryManager.addToHistory(companionKey, "" + response.trim());
        var readable = require("stream").Readable;
        let s = new readable();
        s.push(response);
        s.push(null);

        if (response !== undefined && response.length > 0) {
            memoryManager.addToHistory(companionKey, "" + response.trim());
        }

        await prismadb.companion.update({
            where: {
                id: params.id
            },
            data: {
                messages: {
                    create: {
                        content: response.toString(),
                        role: "system",
                        userId: user.id
                    }
                }
            }
        }).catch((error) => { console.log(error) });
        console.log("mongodb updated companion2");

        return new StreamingTextResponse(s);

    } catch (error) {
        return new NextResponse("internal server error", { status: 500 });
    }
}