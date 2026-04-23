// src/routes/alunoRoutes.ts
import { Router } from "express";
import AlunoController from "../../controllers/Aluno/AlunoController.js";
import { validateSchema } from "../../middlewares/validateSchemaMiddleware.js";
import { authMiddleware, AuthRequest } from "../../middlewares/authMiddleware.js";
import { autorizado } from "../../middlewares/authorizationMiddleware.js";

import * as schema from "../../schemas/alunoSchema.js";

const alunoController = new AlunoController();
const router = Router();

router.get("/", authMiddleware,  alunoController.getAll);
router.get("/:id", authMiddleware,  validateSchema(schema.alunoGetByIdSchema, "params"), alunoController.getById);

router.post("/",  validateSchema(schema.alunoCreateSchema) , alunoController.create);

router.put("/:id", authMiddleware,  validateSchema(schema.alunoUpdateIdSchema, "params"), validateSchema(schema.alunoUpdateSchema, "body") , alunoController.update);
router.delete("/:id", authMiddleware,  validateSchema(schema.alunoDeleteSchema, "params"), alunoController.delete);

router.patch("/:id/perfil", authMiddleware, autorizado(["ADMIN"]), validateSchema(schema.alunoUpdatePerfilSchema, "body"), alunoController.updatePerfilUsuario);

export default router;
