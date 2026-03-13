import { Response, Request } from "express";

import { Router } from "express";

import alunoRoutes from "../routes/Aluno/alunoRoutes.js"
import loginRoutes from "../routes/Paginas/loginRoutes.js"
import homeRoutes from "../routes/Paginas/homeRoutes.js";
import monitorRoutes from "../routes/Monitor/monitorRoutes.js"
import monitoriaRoutes from "../routes/Monitoria/monitoriaRoutes.js"
import disciplinaRoutes from "../routes/Disciplina/disciplinaRoutes.js"
import inscriacaoRoutes from "../routes/Inscricao/inscricaoRoutes.js"

const router = Router();


router.get("/", (req: Request, res: Response) => {
  res.redirect("pages/login.html");
}); // funciona apenas localmente


router.use("/aluno", alunoRoutes);
router.use("/monitor" , monitorRoutes )
router.use("/disciplina" , disciplinaRoutes )
router.use("/monitoria" , monitoriaRoutes )
router.use("/inscricoes" , inscriacaoRoutes)

router.use("/login", loginRoutes);
router.use("/home" , homeRoutes )

export default router;
