//this is a node cool script that will populate the database with initial data. Command is "node script/seed.ts";
const { PrismaClient } = require("@prisma/client");//yes, node does not support traditional import. I have had problems with this before.

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                { name: "Famous People" },
                { name: "Movies & TV" },
                { name: "Musicians" },
                { name: "Games" },
                { name: "Animals" },
                { name: "Philosophy" },
                { name: "Scientists" },
                { name: "Luka" }
            ]
        })
    } catch (error) {
        console.error("error in seed", error)
    } finally {
        await db.$disconnect();
    }
}

main();