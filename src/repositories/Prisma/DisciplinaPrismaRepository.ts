import { prisma } from "../Prisma/client.js";
import { Disciplina } from "@prisma/client";

class DisciplinaPrismaRepository {
  async getAll(): Promise<Disciplina[]> {
    const dadosDisciplina = await prisma.disciplina.findMany();
    return dadosDisciplina;
  }

  async getById(id: number): Promise<Disciplina | null> {
    const DisciplinaDados = await prisma.disciplina.findFirst({
      where: {
        id: id,
      },
    });

    return DisciplinaDados;
  }

  async create(data: Disciplina): Promise<Disciplina> {
    const novADisciplina = await prisma.disciplina.create({
      data,
    });

    return novADisciplina;
  }

  async update(id: number, data: Disciplina): Promise<Disciplina | null> {
    const DisciplinaAtualizada = await prisma.disciplina.update({
      data,
      where: {
        id: id,
      },
    });

    return DisciplinaAtualizada;
  }

  async delete(id: number): Promise<Disciplina> {
    const DisciplinaApagada = await prisma.disciplina.delete({
      where: {
        id: id,
      },
    });

    return DisciplinaApagada;
  }
}

export default DisciplinaPrismaRepository;
