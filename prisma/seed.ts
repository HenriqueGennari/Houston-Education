import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 1. Perfis
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

  // 2. Alunos
  const senhaHash = await bcrypt.hash("123456", 10);

  const alunos = [
    {
      nome: "Houston",
      email: "houston@email.com",
      senha: senhaHash,
      matricula: "2024001",
      perfilId: 1,
    },
    {
      nome: "Monitor Paulo",
      email: "paulo@email.com",
      senha: senhaHash,
      matricula: "2024002",
      perfilId: 2,
    },
    {
      nome: "João",
      email: "joao@email.com",
      senha: senhaHash,
      matricula: "2024003",
      perfilId: 3,
    },
  ];

  for (const aluno of alunos) {
    await prisma.aluno.upsert({
      where: { email: aluno.email },
      update: {},
      create: aluno,
    });
  }
  console.log("Seed concluído: 3 alunos inseridos/atualizados.");

  // 3. Disciplinas
  const disciplinas = [
    { nome: "Banco de dados" },
    { nome: "Lógica de programação" },
  ];

  for (const disciplina of disciplinas) {
    const existe = await prisma.disciplina.findFirst({
      where: { nome: disciplina.nome },
    });
    if (!existe) {
      await prisma.disciplina.create({ data: disciplina });
    }
  }
  console.log("Seed concluído: 2 disciplinas inseridas/atualizadas.");

  // 4. Campus
  const campusList = [
    { id: 1, nome: "Asa norte", descricao: "Campus localizado na Asa Norte" },
    { id: 2, nome: "Taguatinga", descricao: "Campus localizado em Taguatinga" },
  ];

  for (const campus of campusList) {
    await prisma.campus.upsert({
      where: { id: campus.id },
      update: {},
      create: campus,
    });
  }

  await prisma.$executeRaw`SELECT setval('campus_id_seq', 2)`;
  console.log("Seed concluído: 2 campus inseridos/atualizados.");

  // 5. Locais
  const locais = [
    { id: 1, nome: "Sala 170", campusId: 1 },
    { id: 2, nome: "Sala 160", campusId: 2 },
  ];

  for (const local of locais) {
    await prisma.local.upsert({
      where: { id: local.id },
      update: { campusId: local.campusId },
      create: local,
    });
  }

  await prisma.$executeRaw`SELECT setval('local_id_seq', 2)`;
  console.log("Seed concluído: 2 locais inseridos/atualizados.");

  // 6. Monitorias
  const monitor = await prisma.aluno.findUnique({ where: { email: "paulo@email.com" } });
  const bd = await prisma.disciplina.findFirst({ where: { nome: "Banco de dados" } });
  const logica = await prisma.disciplina.findFirst({ where: { nome: "Lógica de programação" } });
  const sala170 = await prisma.local.findUnique({ where: { id: 1 } });
  const sala160 = await prisma.local.findUnique({ where: { id: 2 } });

  if (monitor && bd && sala170) {
    const existe1 = await prisma.monitoria.findFirst({
      where: { nome_monitoria: "Monitoria de Banco de Dados" },
    });
    if (!existe1) {
      await prisma.monitoria.create({
        data: {
          nome_monitoria: "Monitoria de Banco de Dados",
          inicio: new Date("2026-04-23T14:00:00Z"),
          fim: new Date("2026-04-23T16:00:00Z"),
          monitorId: monitor.id,
          disciplinaId: bd.id,
          localId: sala170.id,
        },
      });
    }
  }

  if (monitor && logica && sala160) {
    const existe2 = await prisma.monitoria.findFirst({
      where: { nome_monitoria: "Monitoria de Lógica de Programação" },
    });
    if (!existe2) {
      await prisma.monitoria.create({
        data: {
          nome_monitoria: "Monitoria de Lógica de Programação",
          inicio: new Date("2026-04-24T10:00:00Z"),
          fim: new Date("2026-04-24T12:00:00Z"),
          monitorId: monitor.id,
          disciplinaId: logica.id,
          localId: sala160.id,
        },
      });
    }
  }

  console.log("Seed concluído: 2 monitorias inseridas/atualizadas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
