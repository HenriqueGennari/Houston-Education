import { Response, Request } from "express";

import { Router } from "express";
import alunoRoutes from "./Aluno/alunoRoutes.js"
import loginRoutes from "./Paginas/loginRoutes.js"
import homeRoutes from "./Paginas/homeRoutes.js";
import monitoriaRoutes from "./Monitoria/monitoriaRoutes.js"
import disciplinaRoutes from "./Disciplina/disciplinaRoutes.js"
import inscriacaoRoutes from "./Inscricao/inscricaoRoutes.js"

const router = Router();


router.get("/", (req: Request, res: Response) => {
  res.redirect("pages/login.html");
}); // funciona apenas localmente


router.use("/alunos", alunoRoutes);
router.use("/disciplinas" , disciplinaRoutes )
router.use("/monitorias" , monitoriaRoutes )
router.use("/inscricoes" , inscriacaoRoutes)

router.use("/login", loginRoutes);
router.use("/home" , homeRoutes )

export default router;
