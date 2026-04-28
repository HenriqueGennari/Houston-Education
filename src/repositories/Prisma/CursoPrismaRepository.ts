import { prisma } from "./client.js";
import { Curso } from "@prisma/client";

class CursoPrismaRepository {
  async getAll(): Promise<Curso[]> {
    const cursos = await prisma.curso.findMany();
    return cursos;
  }
}

export default CursoPrismaRepository;
