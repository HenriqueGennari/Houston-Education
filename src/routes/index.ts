import { Response, Request } from "express";

import { Router } from "express";
<<<<<<< HEAD
import alunoRoutes from "../routes/Aluno/alunoRoutes.js"
import loginRoutes from "../routes/Paginas/loginRoutes.js"
import homeRoutes from "../routes/Paginas/homeRoutes.js";
import monitorRoutes from "../routes/Monitor/monitorRoutes.js"
import monitoriaRoutes from "../routes/Monitoria/monitoriaRoutes.js"
import disciplinaRoutes from "../routes/Disciplina/disciplinaRoutes.js"
import inscriacaoRoutes from "../routes/Inscricao/inscricaoRoutes.js"
=======
import alunoRoutes from "./Aluno/alunoRoutes.js"
import loginRoutes from "./Paginas/loginRoutes.js"
import homeRoutes from "./Paginas/homeRoutes.js";
import monitoriaRoutes from "./Monitoria/monitoriaRoutes.js"
import disciplinaRoutes from "./Disciplina/disciplinaRoutes.js"
import inscriacaoRoutes from "./Inscricao/inscricaoRoutes.js"
>>>>>>> 6854b59704fb916abdb32801500d2bd5d14bdfff

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
