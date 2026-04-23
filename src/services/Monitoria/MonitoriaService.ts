import MonitoriaPrismaRepository from "../../repositories/Prisma/MonitoriaPrismaRepository.js";
import { Monitoria } from "@prisma/client";

interface MonitoriaInput {
  nome_monitoria: string;
  descricao?: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  localId?: string;
  monitorId: string;
  disciplinaId: string;
}

class MonitoriaService {
  constructor(private _monitoriaRepository: MonitoriaPrismaRepository) {}

  async getAll(): Promise<Monitoria[]> {
    const dadosmonitoria = await this._monitoriaRepository.getAll();
    return dadosmonitoria;
  }

  async getDisponiveis(): Promise<Monitoria[]> {
    const dadosmonitoria = await this._monitoriaRepository.getDisponiveis();
    return dadosmonitoria;
  }

  async create(dados: MonitoriaInput): Promise<Monitoria> {
    const inicio = new Date(`${dados.data}T${dados.hora_inicio}:00`);
    const fim = new Date(`${dados.data}T${dados.hora_fim}:00`);

    if (inicio >= fim) {
      throw new Error("HORARIO_INVALIDO: O horário de início deve ser anterior ao horário de fim.");
    }

    const dadosParaPrisma: any = {
      nome_monitoria: dados.nome_monitoria,
      inicio,
      fim,
      monitorId: dados.monitorId,
      disciplinaId: parseInt(dados.disciplinaId, 10),
    };

    if (dados.descricao) {
      dadosParaPrisma.descricao = dados.descricao;
    }

    if (dados.localId) {
      dadosParaPrisma.localId = parseInt(dados.localId, 10);
    }

    const dadosMonitoria = await this._monitoriaRepository.create(dadosParaPrisma);
    return dadosMonitoria;
  }

  async getById(id: string): Promise<Monitoria> {
    const monitoriaDados = await this._monitoriaRepository.getById(id);

    if (!monitoriaDados) {
      throw new Error("MONITORIA_INEXISTENTE");
    }

    return monitoriaDados;
  }

  async update(
    id: string,
    dados: Partial<MonitoriaInput>
  ): Promise<Monitoria> {
    const monitoriaAtual = await this._monitoriaRepository.getById(id);

    if (!monitoriaAtual) {
      throw new Error("MONITORIA_INEXISTENTE");
    }

    const dataAtual = monitoriaAtual.inicio.toISOString().split("T")[0];
    const horaInicioAtual = monitoriaAtual.inicio.toISOString().substring(11, 16);
    const horaFimAtual = monitoriaAtual.fim.toISOString().substring(11, 16);

    const dataString = dados.data ?? dataAtual;
    const horaInicioString = dados.hora_inicio ?? horaInicioAtual;
    const horaFimString = dados.hora_fim ?? horaFimAtual;

    const inicio = new Date(`${dataString}T${horaInicioString}:00`);
    const fim = new Date(`${dataString}T${horaFimString}:00`);

    if (inicio >= fim) {
      throw new Error("HORARIO_INVALIDO: O horário de início deve ser anterior ao horário de fim.");
    }

    const dadosAtualizados: any = {
      ...dados,
      inicio,
      fim,
    };

    if (dados.disciplinaId) {
      dadosAtualizados.disciplinaId = parseInt(dados.disciplinaId, 10);
    }

    if (dados.localId) {
      dadosAtualizados.localId = parseInt(dados.localId, 10);
    }

    delete dadosAtualizados.data;
    delete dadosAtualizados.hora_inicio;
    delete dadosAtualizados.hora_fim;

    const dadosMonitoria = await this._monitoriaRepository.update(
      id,
      dadosAtualizados
    );

    if (!dadosMonitoria) {
      throw new Error("ERRO_AO_ATUALIZAR");
    }

    return dadosMonitoria;
  }

  async delete(id: string): Promise<Monitoria> {
    const monitoriaDados = await this._monitoriaRepository.delete(id);

    if (!monitoriaDados) {
      throw new Error("MONITORIA_INEXISTENTE");
    }

    return monitoriaDados;
  }
}

export default MonitoriaService;
