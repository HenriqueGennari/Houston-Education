import LocalController from "../../controllers/Local/LocalController.js";
import { Router } from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { autorizado } from "../../middlewares/authorizationMiddleware.js";

const router = Router();

router.get("/", authMiddleware, autorizado(["ADMIN", "MONITOR", "ALUNO"]), LocalController.getAll);

export default router;
