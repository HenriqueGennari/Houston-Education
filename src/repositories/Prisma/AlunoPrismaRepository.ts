import { PrismaClient, Prisma, Aluno } from "@prisma/client";

const prisma = new PrismaClient();

const alunoWithPerfil = Prisma.validator<Prisma.AlunoDefaultArgs>()({
    include: { perfil: true }
});

type AlunoWithPerfil = Prisma.AlunoGetPayload<typeof alunoWithPerfil>;

class AlunoPrismaRepository {
    async getAll(perfilNome?: string): Promise<AlunoWithPerfil[]> {
        const alunos = await prisma.aluno.findMany({
            where: perfilNome ? {
                perfil: {
                    nome: perfilNome
                }
            } : undefined,
            include: {
                perfil: true
            }
        });

        return alunos;
    }

    async findByEmail(email: string): Promise<AlunoWithPerfil | null> {
        const alunoEmail = await prisma.aluno.findFirst({
            where: {
                email: email
            },
            include: {
                perfil: true
            }
        });

        return alunoEmail;
    }

    async getById(id: string): Promise<AlunoWithPerfil | null> {
        const aluno = await prisma.aluno.findFirst({
            where: {
                id: id
            },
            include: {
                perfil: true
            }
        });

        return aluno;
    }
    async create(data : Aluno) : Promise <Aluno>{
       
        const novoAluno = await prisma.aluno.create({
            data
        })

        return novoAluno;
    }


    async update(id : string, data : Aluno) : Promise <Aluno | null>{
        const alunoAtualizado = await prisma.aluno.update({
            data, where : {
                id : id
            }
        })

        return alunoAtualizado;

    }
    async delete(id : string) : Promise <Aluno>{
        const alunoApagado = await prisma.aluno.delete({
            where : {
                id : id
            }
        })

        return alunoApagado;
    }

    async updatePerfil(id: string, perfilId: number): Promise<Aluno | null> {
        const alunoAtualizado = await prisma.aluno.update({
            data: { perfilId },
            where: { id }
        });

        return alunoAtualizado;
    }
}

export default AlunoPrismaRepository;