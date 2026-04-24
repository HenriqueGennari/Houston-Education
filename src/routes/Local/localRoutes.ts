import LocalController from "../../controllers/Local/LocalController.js";
import { Router } from "express";
import { autenticado } from "../../middlewares/autenticadoMiddleware.js";
import { autorizado } from "../../middlewares/autorizadoMiddleware.js";

const router = Router();

router.get("/", autenticado, autorizado(["ADMIN", "MONITOR", "ALUNO"]), LocalController.getAll);

export default router;
