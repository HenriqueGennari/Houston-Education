import { json } from "stream/consumers";
import MonitoriaPrismaRepository from "../../repositories/Prisma/MonitoriaPrismaRepository.js";
import { Monitoria } from "@prisma/client";

interface MonitoriaInput {
  nome_monitoria: string;
  descricao?: string;
  data: string;
  hora_inicio: string;
  hora_fim: string;
  localId: string;
  monitorId: string;
  disciplinaId: string;
} // preciso tirar isso daqui e colocar no model

// essas funções foram criadas para resolver o problema de 3h atrasadas que ficavam as monitorias em produção
function criarDateBRT(data: string, hora: string): Date {
  return new Date(`${data}T${hora}:00-03:00`);
}

function extrairHoraBRT(date: Date): string {
  return date.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

class MonitoriaService {
  constructor(private _monitoriaRepository: MonitoriaPrismaRepository) { }

  async getAll(): Promise<Monitoria[]> {
    const dadosmonitoria = await this._monitoriaRepository.getAll();
    return dadosmonitoria;
  } // get de todas as monitorias do sistema

  async getDisponiveis(): Promise<Monitoria[]> {
    const dadosmonitoria = await this._monitoriaRepository.getDisponiveis();
    return dadosmonitoria;
  } // get de todas as monitorias que ainda vão acontecer

  async getByMonitor(monitorId: string): Promise<Monitoria[]> {
    const dadosmonitoria = await this._monitoriaRepository.getByMonitor(monitorId);
    return dadosmonitoria;
  } // get de todas as monitorias de um monitor específico 

  async getById(id: string): Promise<Monitoria> {
    const monitoriaDados = await this._monitoriaRepository.getById(id);

    if (!monitoriaDados) {
      throw new Error("MONITORIA_INEXISTENTE");
    }

    return monitoriaDados;
  } // get pelo id da monitoria

  async create(dados: MonitoriaInput): Promise<Monitoria> {
    const inicio = criarDateBRT(dados.data, dados.hora_inicio);
    const fim = criarDateBRT(dados.data, dados.hora_fim);

    if (inicio >= fim) {
      throw new Error("HORARIO_INVALIDO: O horário de início deve ser anterior ao horário de fim.");
    }

    
    const dadosFormatados: any = {
      nome_monitoria: dados.nome_monitoria,
      inicio,
      fim,
      monitorId: dados.monitorId,
      disciplinaId: parseInt(dados.disciplinaId, 10),
      localId : parseInt (dados.localId, 10)
      };

    if (dados.descricao) {
      dadosFormatados.descricao = dados.descricao;
    }

    const conflito = await this._monitoriaRepository.conflitoHorario(dadosFormatados.localId, inicio, fim)

    if (conflito){
      throw new Error ("CONFLITO_HORARIO_MONITORIA")
    }

    const monitoriaNova = await this._monitoriaRepository.create(dadosFormatados)


    return monitoriaNova;
  }

  async update(id: string, dados: Partial<MonitoriaInput>): Promise<Monitoria> {
    const monitoriaAtual = await this._monitoriaRepository.getById(id);

    if (!monitoriaAtual) {
      throw new Error("MONITORIA_INEXISTENTE");
    }

    const dataAtual = monitoriaAtual.inicio.toISOString().split("T")[0];
    const horaInicioAtual = extrairHoraBRT(monitoriaAtual.inicio);
    const horaFimAtual = extrairHoraBRT(monitoriaAtual.fim);

    const dataString = dados.data ?? dataAtual;
    const horaInicioString = dados.hora_inicio ?? horaInicioAtual;
    const horaFimString = dados.hora_fim ?? horaFimAtual;

    const inicio = criarDateBRT(dataString, horaInicioString);
    const fim = criarDateBRT(dataString, horaFimString);

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