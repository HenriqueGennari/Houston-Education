import CursoController from "../../controllers/Curso/CursoController.js";
import { Router } from "express";
import { autenticado } from "../../middlewares/autenticadoMiddleware.js";

const router = Router();

router.get("/", autenticado, CursoController.getAll);

export default router;
