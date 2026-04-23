import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const perfis = [
    { id: 1, nome: "ADMIN", descricao: "Administrador do sistema" },
    { id: 2, nome: "MONITOR", descricao: "Usuário que ministra monitorias" },
    { id: 3, nome: "ALUNO", descricao: "Usuário comum" },
  ];

  for (const perfil of perfis) {
    await prisma.perfil.upsert({
      where: { id: perfil.id },
      update: {},
      create: perfil,
    });
  }

  await prisma.$executeRaw`SELECT setval('perfil_id_seq', 3)`;

  console.log("Seed concluído: 3 perfis inseridos/atualizados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
