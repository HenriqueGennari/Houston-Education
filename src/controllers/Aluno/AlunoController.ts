import { Request, Response } from "express";
import AlunosService from "../../services/Aluno/AlunoService.js";
import AlunoPrismaRepository from "../../repositories/Prisma/AlunoPrismaRepository.js";

const alunoService = new AlunosService(new AlunoPrismaRepository());

class AlunoController{


    async getAll(Req : Request, Res : Response) {
        try {
            const alunosDados = await alunoService.getAll();
            Res.status(200).json(alunosDados)   

        } catch (err : any) {
            return Res.status(500).json({error : err.message})
        }
    }
    async create(Req : Request, Res : Response){
        try {
            const dados = Req.body;
            const dadosAlunos = await alunoService.create(dados)

            return Res.status(200).json(dadosAlunos);
            
        } catch (err : any) {
            return Res.status(400).json({ erro: err.message });
        }
    }
    
    async getById(Req : Request, Res : Response){
        try {
            const {id} = Req.params;
            const alunosDados = await alunoService.getById(id)

            return Res.status(200).json(alunosDados)

        } catch (err : any) {
            return Res.status(400).json({error : err.message})
        }
    }

    async update(Req : Request, Res : Response){
        try {
            const {id} = Req.params
            const dados = Req.body

            const alunoDados = await alunoService.update(id, dados)


            return Res.status(200).json(alunoDados)
        } catch (err : any) {
            Res.status(400).json({error : err.message})
        }
    }
    async delete(Req : Request, Res : Response){
        try {

            const {id} = Req.params
            const alunoDados = await alunoService.delete(id)

            return Res.status(200).json(alunoDados)
            
        } catch (err : any) {
            return Res.status(400).json({error : err.message})
        }
    }
}


export default AlunoController;