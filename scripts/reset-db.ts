import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    const tables = await prisma.$queryRaw<
      { tablename: string }[]
    >`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;

    console.log(`Tabelas encontradas: ${tables.map(t => t.tablename).join(", ")}`);

    for (const { tablename } of tables) {
      await prisma.$executeRawUnsafe(`DELETE FROM "${tablename}" CASCADE;`);
      console.log(`Dados apagados da tabela: ${tablename}`);
    }

    console.log("Todos os dados foram apagados com sucesso!");

  } catch (error) {
    console.error("Erro ao limpar o banco de dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
