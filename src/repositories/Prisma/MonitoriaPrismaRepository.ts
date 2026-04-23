import { prisma } from "../Prisma/client.js";
import { Monitoria, Prisma } from "@prisma/client";

class MonitoriaPrismaRepository {
  async getAll(): Promise<Monitoria[]> {
    const dadosMonitoria = await prisma.monitoria.findMany({
      include: {
        disciplina: {
          select: {
            descricao: true,
            nome: true,
          },
        },
        monitor: {
          select: {
            nome: true,
          },
        },
      },
    });
    return dadosMonitoria;
  }

  async getById(id: string): Promise<Monitoria | null> {
    const monitoriaDados = await prisma.monitoria.findFirst({
      where: {
        id: id,
      },
    });

    return monitoriaDados;
  }

  async create(data: Prisma.MonitoriaUncheckedCreateInput): Promise<Monitoria> {
    const novAMonitoria = await prisma.monitoria.create({
      data,
    });

    return novAMonitoria;
  }

  async update(
    id: string,
    data: Prisma.MonitoriaUncheckedUpdateInput
  ): Promise<Monitoria | null> {
    const monitoriaAtualizadA = await prisma.monitoria.update({
      data,
      where: {
        id: id,
      },
    });

    return monitoriaAtualizadA;
  }

  async delete(id: string): Promise<Monitoria> {
    const monitoriaApagada = await prisma.monitoria.delete({
      where: {
        id: id,
      },
    });

    return monitoriaApagada;
  }
}


export default MonitoriaPrismaRepository;