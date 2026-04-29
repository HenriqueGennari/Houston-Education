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

  async create(Req: Request, Res: Response) {
    try {
      const curso = await cursoService.create(Req.body);
      return Res.status(201).json(curso);
    } catch (err: any) {
      if (err.message === "CURSO_INEXISTENTE") {
        return Res.status(404).json({ erro: err.message });
      }
      return Res.status(500).json({ erro: err.message });
    }
  }

  async update(Req: Request, Res: Response) {
    try {
      const id = parseInt(Req.params.id, 10);
      const curso = await cursoService.update(id, Req.body);
      return Res.status(200).json(curso);
    } catch (err: any) {
      if (err.message === "CURSO_INEXISTENTE") {
        return Res.status(404).json({ erro: err.message });
      }
      return Res.status(500).json({ erro: err.message });
    }
  }

  async delete(Req: Request, Res: Response) {
    try {
      const id = parseInt(Req.params.id, 10);
      await cursoService.delete(id);
      return Res.status(204).send();
    } catch (err: any) {
      if (err.message === "CURSO_INEXISTENTE") {
        return Res.status(404).json({ erro: err.message });
      }
      return Res.status(500).json({ erro: err.message });
    }
  }
}

export default new CursoController();
