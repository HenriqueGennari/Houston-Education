import { prisma } from "../Prisma/client.js";
import { Monitoria, Prisma } from "@prisma/client";

class MonitoriaPrismaRepository {
  async getAll(): Promise<any[]> {
    const dadosMonitoria = await prisma.monitoria.findMany({
      include: {
        disciplina: {
          include: {
            cursos: {
              include: {
                curso: {
                  select: {
                    id: true,
                    nome: true,
                  },
                },
              },
            },
          },
        },
        monitor: {
          select: {
            nome: true,
          },
        },
        local: {
          select: {
            nome: true,
            campusId: true,
            campus: {
              select: {
                nome: true,
              },
            },
          },
        },
        _count: {
          select: {
            inscricoes: true,
          },
        },
      },
    });
    return dadosMonitoria;
  }

  async getDisponiveis(): Promise<any[]> {
    const dadosMonitoria = await prisma.monitoria.findMany({
      where: {
        fim: {
          gte: new Date(),
        },
      },
      include: {
        disciplina: {
          include: {
            cursos: {
              include: {
                curso: {
                  select: {
                    id: true,
                    nome: true,
                  },
                },
              },
            },
          },
        },
        monitor: {
          select: {
            nome: true,
          },
        },
        local: {
          select: {
            nome: true,
            campusId: true,
            campus: {
              select: {
                nome: true,
              },
            },
          },
        },
        _count: {
          select: {
            inscricoes: true,
          },
        },
      },
    });
    return dadosMonitoria;
  }

  async getByMonitor(monitorId: string): Promise<any[]> {
    const dadosMonitoria = await prisma.monitoria.findMany({
      where: {
        monitorId: monitorId,
      },
      include: {
        disciplina: {
          include: {
            cursos: {
              include: {
                curso: {
                  select: {
                    id: true,
                    nome: true,
                  },
                },
              },
            },
          },
        },
        monitor: {
          select: {
            nome: true,
          },
        },
        local: {
          select: {
            nome: true,
            campusId: true,
            campus: {
              select: {
                nome: true,
              },
            },
          },
        },
        _count: {
          select: {
            inscricoes: true,
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

  async conflitoHorario( localId: number,inicio: Date, fim: Date, monitoriaExistenteId?: string): Promise<boolean> { // lembrar In < Fa and Ia < Fn - se ambos true - HÁ CONFLITO
    const monitoriaExistente = await prisma.monitoria.findFirst({
      where: {
        id: monitoriaExistenteId ? {not : monitoriaExistenteId} : undefined, // estou basicamente dizendo o seguinte: caso o id de uma monitoria exsitente venha, busque um id diferente desse mesmo, e, caso não venha, eu boto como undefined. Eu preciso disso pq na função de update, caso eu não passe o id da própria monitoria que estou atualizando, eu sempre teria um true dessa função. 
        localId,
        fim: { gt: inicio }, 
        inicio: { lt: fim },
      },
    });
    
    return !!monitoriaExistente;
  }

  async create(data: Prisma.MonitoriaUncheckedCreateInput): Promise<Monitoria> {
    const novAMonitoria = await prisma.monitoria.create({
      data,
    });

    return novAMonitoria;
  }

  async update( id: string, data: Prisma.MonitoriaUncheckedUpdateInput ): Promise<Monitoria | null> {
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