const { PrismaClient } = require("../prisma/generated/prisma");

const prisma = new PrismaClient();

async function resetData() {
    await prisma.todo.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("データを初期化しました");
}

resetData()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
