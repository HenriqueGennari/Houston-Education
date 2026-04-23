import DisciplinaPrismaRespository from "../../repositories/Prisma/DisciplinaPrismaRepository.js";
import { Disciplina } from "@prisma/client";


class DisciplinaService {

    constructor (private _DisciplinaRepository : DisciplinaPrismaRespository){}

    async getAll() : Promise <Disciplina[]>{
        const dadosDisciplina = await this._DisciplinaRepository.getAll();
        return dadosDisciplina;
    }
    async create(dados : Disciplina) : Promise<Disciplina>{
            const dadosDisciplina = await this._DisciplinaRepository.create(dados)
            return dadosDisciplina;
        }
    async getById(id : number) : Promise <Disciplina>{
        const DisciplinaDados = await this._DisciplinaRepository.getById(id)

        if (!DisciplinaDados){
            throw new Error ("Disciplina_INEXISTENTE")
        }

        return DisciplinaDados;
    }

    async update(id : number, dados : Disciplina) : Promise <Disciplina>{
        const DisciplinaDados = await this._DisciplinaRepository.update(id, dados)

        if (!DisciplinaDados){
            throw new Error ("ERRO_AO_ATUALIZAR")
        }

        return DisciplinaDados;
    }
    async delete(id : number) : Promise <Disciplina>{
        const DisciplinaDados = await this._DisciplinaRepository.delete(id)

        if (!DisciplinaDados){
            throw new Error ("Disciplina_INEXISTENTE")
        }

        return DisciplinaDados;
    }

}



export default DisciplinaService;