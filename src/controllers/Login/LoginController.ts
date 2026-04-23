import { Request, Response } from "express";
import AuthService from "../../services/Auth/AuthService.js";
import AlunoPrismaRepository from "../../repositories/Prisma/AlunoPrismaRepository.js";
import { generateJWT } from "../../utils/jwt/jwt.js";


const authService = new AuthService(new AlunoPrismaRepository());

class LoginController{

    async login(Req : Request, Res : Response){

        try {            
            const dados = Req.body


            if (!dados.email || !dados.senha){
                return Res.json({erro : "Os dados devem ser preenchidos!"})
            }

            const user = await authService.validateUser(dados.email, dados.senha)

            const perfilNome = (user.perfil as any)?.nome || "";
            const token = await generateJWT({id : user.id, nome : user.nome, email : user.email, perfil : perfilNome} , "2h");
            
            Res.status(200).json({user, token})


            
        } catch (err : any) {
            if(err.message === "CREDENCIAIS_INVALIDAS"){
                return Res.status(401).json({ erro: "CREDENCIAIS_INVALIDAS" });
            }
            if(err.message === "USUARIO_INEXISTENTE"){
                return Res.status(401).json({ erro: "USUARIO_INEXISTENTE" });
            }
            return Res.status(500).json({ erro: "ERRO_INTERNO" });
        }
    }
}

export default LoginController;