import { Request, Response } from "express";
import AlunosService from "../../services/Aluno/AlunoService.js";
import AlunoPrismaRepository from "../../repositories/Prisma/AlunoPrismaRepository.js";

const alunoService = new AlunosService(new AlunoPrismaRepository());

class AlunoController{

    async getAll(Req : Request, Res : Response) {
        try {
            const perfil = Req.query.perfil as string | undefined;

            const skip = parseInt(Req.query.skip as string) || 0;
            const take = parseInt(Req.query.take as string) || 50;
            
            const alunosDados = await alunoService.getAll(perfil, skip, take);
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

    async updatePerfilUsuario(Req : Request, Res : Response){
        try {
            const { id } = Req.params;
            const { perfilId } = Req.body;

            const alunoDados = await alunoService.updatePerfilUsuario(id, perfilId);

            return Res.status(200).json(alunoDados);
        } catch (err : any) {
            if (err.message === "ALUNO_INEXISTENTE") {
                return Res.status(404).json({ error: err.message });
            }
            return Res.status(400).json({ error: err.message });
        }
    }
}


export default AlunoController;