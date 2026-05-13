import { Request, Response } from "express";
import MonitoriaService from "../../services/Monitoria/MonitoriaService.js";
import MonitoriaPrismaRepository from "../../repositories/Prisma/MonitoriaPrismaRepository.js";

const monitoriaService = new MonitoriaService(new MonitoriaPrismaRepository);

class MonitoriaController{


    async getAll(Req : Request, Res : Response){
        try {
            const dadosMonitoria = await monitoriaService.getAll();
            return Res.status(200).json(dadosMonitoria)
        } catch (err : any) {
            Res.status(500).json({err : err.message})
        }
    }
    async getDisponiveis(Req : Request, Res : Response){
        try {
            const dadosMonitoria = await monitoriaService.getDisponiveis();
            return Res.status(200).json(dadosMonitoria)
        } catch (err : any) {
            Res.status(500).json({err : err.message})
        }
    }
    async getByMonitor(Req : Request, Res : Response){
        try {
            const { monitorId } = Req.params;
            const dadosMonitoria = await monitoriaService.getByMonitor(monitorId);
            return Res.status(200).json(dadosMonitoria)
        } catch (err : any) {
            Res.status(500).json({err : err.message})
        }
    }

    async getById(Req : Request, Res : Response){
        try {
            const {id} = Req.params;
            const monitoriaDados = await monitoriaService.getById(id)

            return Res.status(200).json(monitoriaDados)

        } catch (err : any) {
            return Res.status(400).json({error : err.message})
        }
    }

    async create(req: Request, res: Response) {
    try {
        const dados = req.body;
        const monitoriaCriada = await monitoriaService.create(dados);

        return res.status(201).json(monitoriaCriada);

    } catch (err: any) {
        const status = err.message?.startsWith("HORARIO_INVALIDO") ? 400 : 500;
        return res.status(status).json({ erro: err.message});
    }
    }
    async update(Req : Request, Res : Response){
        try {
            const {id} = Req.params
            const dados = Req.body

            const monitoriaDados = await monitoriaService.update(id, dados)

            return Res.status(200).json(monitoriaDados)
        } catch (err : any) {
            const status = err.message?.startsWith("HORARIO_INVALIDO") ? 400 : 400;
            return Res.status(status).json({error : err.message})
        }
    }
    async delete(Req : Request, Res : Response){
        try {
            const {id} = Req.params
            const monitoriaDados = await monitoriaService.delete(id)

            return Res.status(200).json(monitoriaDados)
            
        } catch (err : any) {
            return Res.status(400).json({error : err.message})
        }
    }
}

export default new MonitoriaController;