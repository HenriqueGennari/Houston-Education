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

        const matriculaString = String(dados.matricula)
        
        const alunoExistente = await this._alunoPrismaRepository.findByEmailAndMatricula(dados.email, matriculaString);

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

    async updateUsuarioByAdmin(id: string, dados: any): Promise<Aluno> {
        const alunoExistente = await this._alunoPrismaRepository.getById(id);
        
        if (!alunoExistente) {
            throw new Error("ALUNO_INEXISTENTE");
        }
        
        const dadosAtualizados: any = {};
        
        if (dados.perfilId !== undefined) {
            dadosAtualizados.perfilId = dados.perfilId;
        }

        if (dados.nome !== undefined) {
            if (dados.nome.trim() === "") {
                throw new Error("NOME_OBRIGATORIO");
            }
            dadosAtualizados.nome = dados.nome;
        }

        if (dados.email !== undefined) {
            if (dados.email.trim() === "") {
                throw new Error("EMAIL_OBRIGATORIO");
            }
            dadosAtualizados.email = dados.email;
        }

        if (dados.matricula !== undefined) {
            if (dados.matricula.length < 8) {
                throw new Error("MATRICULA_INVALIDA");
            }
            dadosAtualizados.matricula = dados.matricula;
        }

        if (dados.senha !== undefined) {
            if (dados.senha.trim() === "") {
                throw new Error("SENHA_OBRIGATORIA");
            }

            const senhaHash = await bcrypt.hash(dados.senha, 10);
            dadosAtualizados.senha = senhaHash;
        }

        if (dadosAtualizados.email || dadosAtualizados.matricula) {
            const alunoDuplicado = await this._alunoPrismaRepository.findByEmailAndMatricula( dadosAtualizados.email || "", dadosAtualizados.matricula || "");

            if (alunoDuplicado && alunoDuplicado.id !== id) {
                if (alunoDuplicado.email === dadosAtualizados.email) {
                    throw new Error("EMAIL_EXISTE");
                }
                if (alunoDuplicado.matricula === dadosAtualizados.matricula) {
                    throw new Error("MATRICULA_EXISTE");
                }
                throw new Error("MATRICULA_OU_EMAIL_EM_USO");
            }
        }

        const alunoAtualizado = await this._alunoPrismaRepository.update(id, dadosAtualizados);

        if (!alunoAtualizado) {
            throw new Error("ERRO_AO_ATUALIZAR_PERFIL");
        }

        return alunoAtualizado;
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