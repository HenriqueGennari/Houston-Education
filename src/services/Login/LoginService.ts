
import AlunoPrismaRepository from "../../repositories/Prisma/AlunoPrismaRepository.js"
import bcrypt from "bcrypt"
import { getPepper } from "../../utils/security/pepper.js";


class AuthService{

    constructor(private _alunoPrismaRepository : AlunoPrismaRepository){}

    async validateUser(email : string, senha : string){ // literalmente validando o login do usuário

        const user = await this.existeUser(email)

        const admin = (user.perfil) ?.nome === "ADMIN"; //vendo se o usuário é admin
        const senhaParaComparar = admin ? senha + getPepper() : senha; //se for, uso a senha vinda da req + o pepper salvo no .env para montar a senha completa

        const senhaValida = await bcrypt.compare(senhaParaComparar, user.senha)

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