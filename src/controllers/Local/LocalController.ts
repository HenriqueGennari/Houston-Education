import { Request, Response } from "express";
import LocalService from "../../services/Local/LocalService.js";
import LocalPrismaRepository from "../../repositories/Prisma/LocalPrismaRepository.js";

const localService = new LocalService(new LocalPrismaRepository());

class LocalController {
  async getAll(_Req: Request, Res: Response) {
    try {
      const locais = await localService.getAll();
      return Res.status(200).json(locais);
    } catch (err: any) {
      return Res.status(500).json({ err: err.message });
    }
  }
}

export default new LocalController();
