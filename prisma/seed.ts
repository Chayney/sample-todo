import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function main() {
    await prisma.todo.createMany({
        data: [
            { text: 'Learn Prisma', completed: false },
            { text: 'Build a TODO app', completed: false },
            { text: 'Push project to GitHub', completed: true },
            { text: 'Deploy to Vercel', completed: false },
            { text: 'Celebrate!', completed: true },
        ],
    });
}

main()
    .then(() => {
        console.log('✅ Dummy data inserted.');
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });