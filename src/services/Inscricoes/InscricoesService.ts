import { Inscricao } from "@prisma/client";
import type InscricoesPrismaRepository from "../../repositories/Prisma/InscricoesPrismaRepository.js";


class InscricaosService{


    constructor(private _inscricaoPrismaRepository: InscricoesPrismaRepository){}

    async getAll() : Promise<Inscricao[]>{
        const InscricaosDados = await this._inscricaoPrismaRepository.getAll()
        return InscricaosDados;
    }
    
    async getInscricaoAluno(alunoId: string) : Promise<Inscricao[]>{
        const InscricaosDados = await this._inscricaoPrismaRepository.getInscricaoAluno(alunoId)
        return InscricaosDados;
    }

    async create(dados : Inscricao) : Promise<Inscricao>{
        const existeInscricao = await this._inscricaoPrismaRepository.findAlunoMonitoria(dados.alunoId, dados.monitoriaId)
        
        if (existeInscricao){
            throw new Error ("INSCRICAO_JA_EXISTE")
        }
        
        const dadosInscricaos = await this._inscricaoPrismaRepository.create(dados)
        return dadosInscricaos;
    }
    async getById(id : number) : Promise <Inscricao>{
        const InscricaoDados = await this._inscricaoPrismaRepository.getById(id)

        if (!InscricaoDados){
            throw new Error ("Inscricao_INEXISTENTE")
        }
        return InscricaoDados;
    }

    async delete(id : number) : Promise <Inscricao>{
        const InscricaoDados = await this._inscricaoPrismaRepository.delete(id)

        if (!InscricaoDados){
            throw new Error ("Inscricao_INEXISTENTE")
        }

        return InscricaoDados;
    }
}


export default InscricaosService