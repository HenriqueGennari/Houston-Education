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

  // 3. Cursos
  const cursos = [
    { nome: "Ciência da Computação" },
    { nome: "Arquitetura" },
    { nome: "Direito" },
  ];

  for (const curso of cursos) {
    const existe = await prisma.curso.findFirst({
      where: { nome: curso.nome },
    });
    if (!existe) {
      await prisma.curso.create({ data: curso });
    }
  }
  await prisma.$executeRaw`SELECT setval('curso_id_seq', 3)`;
  console.log("Seed concluído: 3 cursos inseridos/atualizados.");

  // 4. Disciplinas
  const disciplinasNomes = [
    "Banco de dados",
    "Lógica de programação",
    "Desenho Arquitetônico",
    "Teoria da Arquitetura",
    "Direito Constitucional",
    "Direito Penal",
  ];

  for (const nome of disciplinasNomes) {
    const existe = await prisma.disciplina.findFirst({
      where: { nome },
    });
    if (!existe) {
      await prisma.disciplina.create({ data: { nome } });
    }
  }
  console.log("Seed concluído: 6 disciplinas inseridas/atualizadas.");

  // 4.1 Relação Disciplina-Curso (N:M)
  const disciplinaCursoLinks = [
    { disciplinaNome: "Banco de dados", cursoId: 1 },
    { disciplinaNome: "Lógica de programação", cursoId: 1 },
    { disciplinaNome: "Desenho Arquitetônico", cursoId: 2 },
    { disciplinaNome: "Teoria da Arquitetura", cursoId: 2 },
    { disciplinaNome: "Direito Constitucional", cursoId: 3 },
    { disciplinaNome: "Direito Penal", cursoId: 3 },
  ];

  for (const link of disciplinaCursoLinks) {
    const disciplina = await prisma.disciplina.findFirst({
      where: { nome: link.disciplinaNome },
    });
    if (disciplina) {
      const existe = await prisma.disciplinaCurso.findUnique({
        where: {
          disciplinaId_cursoId: {
            disciplinaId: disciplina.id,
            cursoId: link.cursoId,
          },
        },
      });
      if (!existe) {
        await prisma.disciplinaCurso.create({
          data: {
            disciplinaId: disciplina.id,
            cursoId: link.cursoId,
          },
        });
      }
    }
  }
  console.log("Seed concluído: vínculos disciplina-curso criados.");

  // 5. Campus
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

  // 6. Locais
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

  // 7. Monitorias
  const monitor = await prisma.aluno.findUnique({ where: { email: "paulo@email.com" } });
  const bd = await prisma.disciplina.findFirst({ where: { nome: "Banco de dados" } });
  const logica = await prisma.disciplina.findFirst({ where: { nome: "Lógica de programação" } });
  const sala170 = await prisma.local.findUnique({ where: { id: 1 } });
  const sala160 = await prisma.local.findUnique({ where: { id: 2 } });

  if (monitor && bd && sala170) {
    const m1 = await prisma.monitoria.findFirst({
      where: { nome_monitoria: "Monitoria de Banco de Dados" },
    });
    if (m1) {
      await prisma.monitoria.update({
        where: { id: m1.id },
        data: {
          inicio: new Date("2026-04-29T14:00:00Z"),
          fim: new Date("2026-04-29T16:00:00Z"),
        },
      });
    } else {
      await prisma.monitoria.create({
        data: {
          nome_monitoria: "Monitoria de Banco de Dados",
          inicio: new Date("2026-04-29T14:00:00Z"),
          fim: new Date("2026-04-29T16:00:00Z"),
          monitorId: monitor.id,
          disciplinaId: bd.id,
          localId: sala170.id,
        },
      });
    }
  }

  if (monitor && logica && sala160) {
    const m2 = await prisma.monitoria.findFirst({
      where: { nome_monitoria: "Monitoria de Lógica de Programação" },
    });
    if (m2) {
      await prisma.monitoria.update({
        where: { id: m2.id },
        data: {
          inicio: new Date("2026-04-30T10:00:00Z"),
          fim: new Date("2026-04-30T12:00:00Z"),
        },
      });
    } else {
      await prisma.monitoria.create({
        data: {
          nome_monitoria: "Monitoria de Lógica de Programação",
          inicio: new Date("2026-04-30T10:00:00Z"),
          fim: new Date("2026-04-30T12:00:00Z"),
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
