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
        const alunoExistente = await this._alunoPrismaRepository.findByEmailAndMatricula(dados.email, dados.matricula);

        if (alunoExistente) {
            if (alunoExistente.email === dados.email) {
                throw new Error ("EMAIL_EXISTE")
            }
            if (alunoExistente.matricula === dados.matricula) {
                throw new Error ("MATRICULA_EXISTE")
            }
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

        if (dados.nome !== undefined && dados.nome.trim() === "") {
            throw new Error ("NOME_OBRIGATORIO")
        }

        if (dados.email !== undefined && dados.email.trim() === "") {
            throw new Error ("EMAIL_OBRIGATORIO")
        }

        if (dados.matricula !== undefined && dados.matricula.length < 8) {
            throw new Error ("MATRICULA_INVALIDA")
        }

        if (dados.matricula || dados.email){
            const alunoExistente = await this._alunoPrismaRepository.findByEmailAndMatricula(dados.email || "", dados.matricula || "")

            if (alunoExistente && alunoExistente.id !== id){
                throw new Error ("MATRICULA_OU_EMAIL_EM_USO")
            }
        }

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