import MonitoriaController from "../../controllers/Monitoria/MonitoriaController.js";
import { validateSchema } from "../../middlewares/validateSchemaMiddleware.js";
import * as schema from "../../schemas/monitoriaSchema.js";
import { autenticado } from "../../middlewares/autenticadoMiddleware.js";
import { autorizado } from "../../middlewares/autorizadoMiddleware.js";

import { Router } from "express";



const router = Router();

router.get("/", autenticado, MonitoriaController.getAll);

router.get("/disponiveis", autenticado, MonitoriaController.getDisponiveis);
router.get("/monitor/:monitorId", autenticado, autorizado(["ADMIN", "MONITOR"]) , MonitoriaController.getByMonitor);
router.get("/:id", autenticado, autorizado(["ADMIN"]) , validateSchema(schema.monitoriaGetByIdSchema, "params"), MonitoriaController.getById);

router.post("/", autenticado, autorizado(["ADMIN", "MONITOR"]), validateSchema(schema.monitoriaCreateSchema), MonitoriaController.create); 

router.put("/:id", autenticado, autorizado(["ADMIN", "MONITOR"]),validateSchema(schema.monitoriaUpdateIdSchema, "params"), validateSchema(schema.monitoriaUpdateSchema, "body"), MonitoriaController.update);

router.delete("/:id", autenticado, autorizado(["ADMIN"]) , validateSchema(schema.monitoriaDeleteSchema, "params"), MonitoriaController.delete);

export default router;