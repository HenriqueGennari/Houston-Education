import { PrismaClient } from "@prisma/client";
import { Inscricao } from "@prisma/client";

const prisma = new PrismaClient();

class InscricaoPrismaRepository {
  async getAll(): Promise<Inscricao[]> {
    const Inscricoes = await prisma.inscricao.findMany();
    return Inscricoes;
  }

  async findAlunoMonitoria(
    alunoId: string,
    monitoriaId: string
  ): Promise<Inscricao | null> {
    const inscricao = await prisma.inscricao.findFirst({
      where: {
        alunoId,
        monitoriaId,
      },
    });

    return inscricao;
  }

  async getInscricaoAluno(alunoId: string): Promise<Inscricao[]> {
    const inscricao = await prisma.inscricao.findMany({
      where: {
        alunoId,
      },
    });

    return inscricao;
  }

  async getByMonitoria(monitoriaId: string): Promise<any[]> {
    const inscricoes = await prisma.inscricao.findMany({
      where: {
        monitoriaId,
      },
      include: {
        aluno: {
          select: {
            id: true,
            nome: true,
            matricula: true,
          },
        },
        monitoria: {
          select: {
            id: true,
            nome_monitoria: true,
          },
        },
      },
      orderBy: {
        aluno: {
          nome: "asc",
        },
      },
    });
    return inscricoes;
  }

  async getById(id: number): Promise<Inscricao | null> {
    const InscricaoId = await prisma.inscricao.findFirst({
      where: {
        id: id,
      },
    });

    return InscricaoId;
  }

  async create(data: Inscricao): Promise<Inscricao> {
    const novaInscricao = await prisma.inscricao.create({
      data,
    });

    return novaInscricao;
  }

  async delete(id: number): Promise<Inscricao> {
    const inscricaoApagado = await prisma.inscricao.delete({
      where: {
        id: id,
      },
    });

    return inscricaoApagado;
  }
}

export default InscricaoPrismaRepository;
