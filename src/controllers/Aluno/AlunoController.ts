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

    async getById(Req : Request, Res : Response){
        try {
            const {id} = Req.params;
            const alunosDados = await alunoService.getById(id)

            return Res.status(200).json(alunosDados)

    } catch (err : any) {
        return Res.status(400).json({error : err.message})
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
    async updateUsuarioByAdmin(Req : Request, Res : Response){
        try {
            const { id } = Req.params;
            const dados = { ...Req.body };

            if (dados.perfilId !== undefined) {
                dados.perfilId = parseInt(dados.perfilId, 10);
            }

            const alunoDados = await alunoService.updateUsuarioByAdmin(id, dados);

            return Res.status(200).json(alunoDados);
        } catch (err : any) {
            if (err.message === "ALUNO_INEXISTENTE") {
                return Res.status(404).json({ error: err.message });
            }
            if (err.message === "EMAIL_EXISTE") {
                return Res.status(409).json({ erro: "EMAIL_EXISTE" });
            }
            if (err.message === "MATRICULA_EXISTE") {
                return Res.status(409).json({ erro: "MATRICULA_EXISTE" });
            }
            if (err.message === "MATRICULA_OU_EMAIL_EM_USO") {
                return Res.status(409).json({ erro: "MATRICULA_OU_EMAIL_EM_USO" });
            }
            return Res.status(400).json({ error: err.message });
        }
    }
    async updateSenha(Req: Request, Res: Response) {
        try {
            const { id } = Req.params;
            const { senha, senhaConfirmada } = Req.body;

            if (senha != senhaConfirmada){
                throw new Error ("SENHAS_NAO_COINCIDEM")
            }
            
            const usuario = (Req as any).user;

            const alunoDados = await alunoService.updateSenha(id, senha, usuario.id);

            return Res.status(200).json(alunoDados);
            
        } catch (err: any) {
            if (err.message === "NAO_AUTORIZADO") {
                return Res.status(403).json({ error: err.message });
            }
            if (err.message === "ALUNO_INEXISTENTE") {
                return Res.status(404).json({ error: err.message });
            }
            if (err.message === "SENHA_OBRIGATORIA") {
                return Res.status(400).json({ error: err.message });
            }
            return Res.status(400).json({ error: err.message });
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