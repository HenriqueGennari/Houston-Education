import { Request, Response } from "express";
import CursoService from "../../services/Curso/CursoService.js";
import CursoPrismaRepository from "../../repositories/Prisma/CursoPrismaRepository.js";

const cursoService = new CursoService(new CursoPrismaRepository());

class CursoController {
  async getAll(_Req: Request, Res: Response) {
    try {
      const cursos = await cursoService.getAll();
      return Res.status(200).json(cursos);
    } catch (err: any) {
      return Res.status(500).json({ erro: err.message });
    }
  }
}

export default new CursoController();
