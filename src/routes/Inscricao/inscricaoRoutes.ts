import InscricoesController from "../../controllers/Inscricoes/InscricoesController.js";
import { Router } from "express";

import { validateSchema } from "../../middlewares/validateSchemaMiddleware.js";
import * as schema from "../../schemas/inscricoesSchema.js";
import { autenticado, AuthRequest } from "../../middlewares/autenticadoMiddleware.js";
import { autorizado } from "../../middlewares/autorizadoMiddleware.js";


const router = Router();

router.get("/", autenticado, autorizado(["ADMIN", "MONITOR"]), InscricoesController.getAll);

router.get("/aluno", autenticado, autorizado(["ADMIN", "MONITOR", "ALUNO"]), InscricoesController.getInscricaoAluno); // lembra que essa rota é pra pegar as inscrições de um unico aluno ATRAVÉS DO TOKEN

router.get("/:id", autenticado, autorizado(["ADMIN", "MONITOR"]), validateSchema(schema.inscricoesGetByIdSchema, "params"), InscricoesController.getById);

router.post("/", autenticado, validateSchema(schema.inscricoesCreateSchema), InscricoesController.create);

router.delete("/:id", autenticado, validateSchema(schema.inscricoesDeleteSchema, "params"), InscricoesController.delete);

export default router;