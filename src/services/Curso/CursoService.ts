import CursoPrismaRepository from "../../repositories/Prisma/CursoPrismaRepository.js";
import { Curso } from "@prisma/client";

class CursoService {
  constructor(private _cursoRepository: CursoPrismaRepository) {}

  async getAll(): Promise<Curso[]> {
    return await this._cursoRepository.getAll();
  }
}

export default CursoService;
