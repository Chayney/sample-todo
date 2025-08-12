import { PrismaClient } from "./generated/prisma";

const prisma = new PrismaClient();

async function main() {
    await prisma.todo.createMany({
        data: [
            { text: 'Learn Prisma', completed: false, userId: 0 },
            { text: 'Build a TODO app', completed: false, userId: 0 },
            { text: 'Push project to GitHub', completed: true, userId: 0 },
            { text: 'Deploy to Vercel', completed: false, userId: 0 },
            { text: 'Celebrate!', completed: true, userId: 0 },
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