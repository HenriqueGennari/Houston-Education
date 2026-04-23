import { Aluno } from "@prisma/client";
import type AlunoPrismaRepository from "../../repositories/Prisma/AlunoPrismaRepository.js";
import bcrypt from  "bcrypt";


class AlunosService{

    // constructor(private _alunoRespository : AlunoRepository){}
    constructor(private _alunoPrismaRepository: AlunoPrismaRepository){}

    async getAll(perfilNome?: string) : Promise<Aluno[]>{
        const alunosDados = await this._alunoPrismaRepository.getAll(perfilNome)
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
}


export default AlunosService