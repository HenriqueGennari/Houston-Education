import { Request, Response } from "express";
import InscricoesService from "../../services/Inscricoes/InscricoesService.js";
import InscricoesPrismaRepository from "../../repositories/Prisma/InscricoesPrismaRepository.js";
import { AuthRequest } from "../../middlewares/autenticadoMiddleware.js";

const inscricoesService = new InscricoesService(new InscricoesPrismaRepository());

class InscricoesController {

    async getAll(Req: Request, Res: Response) {
        try {
            const inscricoesDados = await inscricoesService.getAll();
            Res.status(200).json(inscricoesDados)

        } catch (err: any) {
            return Res.status(500).json({ error: err.message })
        }
    }

    async getInscricaoAluno(Req: AuthRequest, Res: Response) {
        try {

            if (Req.user?.id == undefined) {
                return Res.status(500).json({ error: "USUARIO_SEM_TOKNEN" })
            }

            const alunoId = Req.user?.id;
            const inscricoesDados = await inscricoesService.getInscricaoAluno(alunoId);
            Res.status(200).json(inscricoesDados)

        } catch (err: any) {
            return Res.status(500).json({ error: err.message })
        }
    }

    async create(Req: Request, Res: Response) {
        try {
            const dados = Req.body;
            const dadosInscricoes = await inscricoesService.create(dados)
            return Res.status(201).json(dadosInscricoes);

        } catch (err: any) {
            return Res.status(400).json({ erro: err.message });
        }
    }

    async getByMonitoria(Req: Request, Res: Response) {
        try {
            const monitoriaId = Req.params.monitoriaId;
            const inscricoesDados = await inscricoesService.getByMonitoria(monitoriaId);
            return Res.status(200).json(inscricoesDados);
        } catch (err: any) {
            return Res.status(500).json({ error: err.message });
        }
    }

    async getById(Req: Request, Res: Response) {
        try {
            const id = parseInt(Req.params.id, 10);
            const inscricoesDados = await inscricoesService.getById(id)

            return Res.status(200).json(inscricoesDados)

        } catch (err: any) {
            return Res.status(400).json({ error: err.message })
        }
    }
    async delete(Req: Request, Res: Response) {
        try {
            const id = parseInt(Req.params.id, 10);
            const inscricoesDados = await inscricoesService.delete(id)

            return Res.status(200).json(inscricoesDados)

        } catch (err: any) {
            return Res.status(400).json({ error: err.message })
        }
    }
}


export default new InscricoesController;