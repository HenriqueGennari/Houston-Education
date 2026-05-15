import LocalPrismaRepository from "../../repositories/Prisma/LocalPrismaRepository.js";
import { Local, Prisma } from "@prisma/client";

class LocalService {
  constructor(private _localRepository: LocalPrismaRepository) {}

  async getAll(): Promise<Local[]> {
    const locais = await this._localRepository.getAll();
    return locais;
  }

  async create(dados: Prisma.LocalUncheckedCreateInput): Promise<Local> {
    const campusId = typeof dados.campusId === "string" ? parseInt(dados.campusId, 10) : dados.campusId;
    if (!campusId || isNaN(campusId)) {
      throw new Error("CAMPUS_INVALIDO");
    }

    const existente = await this._localRepository.findByNomeAndCampus(dados.nome, campusId);
    if (existente) {
      throw new Error("LOCAL_DUPLICADO");
    }

    const local = await this._localRepository.create({ ...dados, campusId });
    return local;
  }

  async getById(id: number): Promise<Local> {
    const local = await this._localRepository.getById(id);
    if (!local) {
      throw new Error("LOCAL_INEXISTENTE");
    }
    return local;
  }

  async update(id: number, dados: Prisma.LocalUncheckedUpdateInput): Promise<Local> {
    const localAtual = await this.getById(id); // nao preciso tratar

    const localAtualizado : any = {
      ...dados,

    }

    if (dados.campusId){
      
    }

    // CONTINUAR DEBUG VER O TIPO DE RETORNO EM DADOS
   /* async update(id: number, dados: Prisma.LocalUncheckedUpdateInput): Promise<Local> {
  console.log("dados recebidos:", dados);
  console.log("tipo do campusId:", typeof dados.campusId);
  console.log("valor do campusId:", dados.campusId);
  // ...
  }*/



    return localAtualizado;
  }

  async delete(id: number): Promise<Local> {
    await this.getById(id);
    const local = await this._localRepository.delete(id);
    if (!local) {
      throw new Error("LOCAL_INEXISTENTE");
    }
    return local;
  }
}

export default LocalService;
