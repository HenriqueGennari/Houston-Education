import  jwt, { SignOptions }  from "jsonwebtoken"
import { Perfil } from "@prisma/client";
import "dotenv/config"; 

export const generateJWT = async (aluno : {id : string, email : string, nome : string, perfil?: string}, expiresIn : string): Promise <string> =>{ // vou adicionar o perfil aqui
    
    const secret : string = process.env.JWT_SECRET || "default";
    const perfilAluno = aluno.perfil || Perfil.ALUNO 
    
    const expiraEm = process.env.JWT_EXPIRES_IN;

    const option : SignOptions = {
        expiresIn : expiresIn as SignOptions["expiresIn"]
        //aqui eu forço o Ts a aceitar o tipo do expiresIn criado por mim como se fosse o mesmo expiresIn do próprio signOpitons. Então estou dizendo: confia em mim, é do mesmo tipo!
    }


    const payloadDados = {
        id : aluno.id,
        nome : aluno.nome,
        email :aluno.email,
        perfil: aluno.perfil
    }

    const token =  jwt.sign(payloadDados, secret, option)


    return token;
};