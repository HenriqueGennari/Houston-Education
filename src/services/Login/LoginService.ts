import { Aluno } from "@prisma/client"
import AlunoPrismaRepository from "../../repositories/Prisma/AlunoPrismaRepository.js"
import bcrypt from "bcrypt"

class AuthService{

    constructor(private _alunoPrismaRepository : AlunoPrismaRepository){}

    async validateUser(email : string, senha : string){ // literalmente validando o login do usuário

        const user = await this.existeUser(email)

        const senhaValida = await bcrypt.compare(senha, user.senha)

        if(!user || !senhaValida){
            throw new Error ("CREDENCIAIS_INVALIDAS");
        }
        
        return user;
    }

    async existeUser(email: string) { // vendo se ele já existe
        const user = await this._alunoPrismaRepository.findByEmailAndMatricula(email, "")

        if (!user) {
            throw new Error("USUARIO_INEXISTENTE")
        }

        return user;
    }
}
 
export default AuthService;