import { Aluno } from "@prisma/client";
import type AlunoPrismaRepository from "../../repositories/Prisma/AlunoPrismaRepository.js";
import bcrypt from  "bcrypt";


class AlunosService{

    // constructor(private _alunoRespository : AlunoRepository){}
    constructor(private _alunoPrismaRepository: AlunoPrismaRepository){}

    async getAll(perfilNome?: string, skip?: number, take?: number) : Promise<Aluno[]>{
        const alunosDados = await this._alunoPrismaRepository.getAll(perfilNome, skip, take)
        return alunosDados;
    }
    
    async create(dados : Aluno) : Promise<Aluno>{
        const emailAluno = await this._alunoPrismaRepository.findByEmail(dados.email);

        if (emailAluno) {
            throw new Error ("EMAIL_EXISTE")
        } 
        
        const senhaHash = await bcrypt.hash(dados.senha, 10);

        const dadosComSenhaHash = {
            ...dados,
            senha : senhaHash
        };

        const dadosAlunos = await this._alunoPrismaRepository.create(dadosComSenhaHash)
        return dadosAlunos;
    }
    async getById(id : string) : Promise <Aluno>{
        const alunoDados = await this._alunoPrismaRepository.getById(id)

        if (!alunoDados){
            throw new Error ("ALUNO_INEXISTENTE")
        }
        return alunoDados;
    }

    async update(id : string, dados : Aluno) : Promise <Aluno>{
        const alunoDados = await this._alunoPrismaRepository.update(id, dados)

        if (!alunoDados){
            throw new Error ("ALUNO_INEXISTENTE")
        }

        return alunoDados;
    }
    async delete(id : string) : Promise <Aluno>{
        const alunoDados = await this._alunoPrismaRepository.delete(id)

        if (!alunoDados){
            throw new Error ("ALUNO_INEXISTENTE")
        }

        return alunoDados;
    }

    async updatePerfilUsuario(id: string, perfilId: number): Promise<Aluno> {
        const alunoExistente = await this._alunoPrismaRepository.getById(id);

        if (!alunoExistente) {
            throw new Error("ALUNO_INEXISTENTE");
        }

        const alunoAtualizado = await this._alunoPrismaRepository.updatePerfil(id, perfilId);

        if (!alunoAtualizado) {
            throw new Error("ERRO_AO_ATUALIZAR_PERFIL");
        }

        return alunoAtualizado;
    }
}


export default AlunosService