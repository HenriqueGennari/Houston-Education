import { PrismaClient, Prisma, Aluno } from "@prisma/client";

const prisma = new PrismaClient();

const alunoWithPerfil = Prisma.validator<Prisma.AlunoDefaultArgs>()({
    include: { perfil: true }
});

type AlunoWithPerfil = Prisma.AlunoGetPayload<typeof alunoWithPerfil>;

class AlunoPrismaRepository {
    async getAll(perfilNome?: string, skip?: number, take?: number): Promise<AlunoWithPerfil[]> {
        const alunos = await prisma.aluno.findMany({
            where: {
                deletedAt: null,
                ...(perfilNome ? {
                    perfil: {
                        nome: perfilNome
                    }
                } : {})
            },
            include: {
                perfil: true
            },
            skip: skip || 0,
            take: take || 50
        });

        return alunos;
    }

    async findByEmailAndMatricula(email: string, matricula: string): Promise<AlunoWithPerfil | null> {
        const aluno = await prisma.aluno.findFirst({
            where: {
                deletedAt: null,
                OR: [
                    { email: email },
                    { matricula: matricula }
                ]
            },
            include: {
                perfil: true
            }
        });

        return aluno;
    }

    async getById(id: string): Promise<AlunoWithPerfil | null> {
        const aluno = await prisma.aluno.findFirst({
            where: {
                id: id,
                deletedAt: null
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
    async delete(id: string): Promise<Aluno> {
        const alunoApagado = await prisma.aluno.update({
            where: { id },
            data: { deletedAt: new Date() }
        });

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