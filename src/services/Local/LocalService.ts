import LocalPrismaRepository from "../../repositories/Prisma/LocalPrismaRepository.js";
import { Local } from "@prisma/client";

class LocalService {
  constructor(private _localRepository: LocalPrismaRepository) {}

  async getAll(): Promise<Local[]> {
    const locais = await this._localRepository.getAll();
    return locais;
  }

  async create(dados: Local): Promise<Local> {
    const local = await this._localRepository.create(dados);
    return local;
  }

  async getById(id: number): Promise<Local> {
    const local = await this._localRepository.getById(id);
    if (!local) {
      throw new Error("LOCAL_INEXISTENTE");
    }
    return local;
  }

  async update(id: number, dados: Local): Promise<Local> {
    const local = await this._localRepository.update(id, dados);
    if (!local) {
      throw new Error("ERRO_AO_ATUALIZAR");
    }
    return local;
  }

  async delete(id: number): Promise<Local> {
    const local = await this._localRepository.delete(id);
    if (!local) {
      throw new Error("LOCAL_INEXISTENTE");
    }
    return local;
  }
}

export default LocalService;
