import CursoPrismaRepository from "../../repositories/Prisma/CursoPrismaRepository.js";
import { Curso } from "@prisma/client";

class CursoService {
  constructor(private _cursoRepository: CursoPrismaRepository) {}

  async getAll(): Promise<Curso[]> {
    return await this._cursoRepository.getAll();
  }

  async create(data: { nome: string; descricao?: string }): Promise<Curso> {
    return await this._cursoRepository.create(data);
  }

  async update(id: number, data: { nome?: string; descricao?: string }): Promise<Curso> {
    const cursoExistente = await this._cursoRepository.getById(id);
    if (!cursoExistente) {
      throw new Error("CURSO_INEXISTENTE");
    }
    return await this._cursoRepository.update(id, data);
  }

  async delete(id: number): Promise<Curso> {
    const cursoExistente = await this._cursoRepository.getById(id);
    if (!cursoExistente) {
      throw new Error("CURSO_INEXISTENTE");
    }
    return await this._cursoRepository.delete(id);
  }
}

export default CursoService;
