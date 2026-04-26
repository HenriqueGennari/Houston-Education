import { Response, Request } from "express";

import { Router } from "express";
import alunoRoutes from "./Aluno/alunoRoutes.js"
import loginRoutes from "./Paginas/loginRoutes.js"
import homeRoutes from "./Paginas/homeRoutes.js";
import monitoriaRoutes from "./Monitoria/monitoriaRoutes.js"
import disciplinaRoutes from "./Disciplina/disciplinaRoutes.js"
import localRoutes from "./Local/localRoutes.js"
import campusRoutes from "./Campus/campusRoutes.js"
import inscriacaoRoutes from "./Inscricao/inscricaoRoutes.js"
import { autenticadoCookie } from "../middlewares/autenticadoMiddleware.js";
const router = Router();


router.get("/", (_req: Request, res: Response) => {
  res.redirect("pages/login.html");
}); // funciona apenas localmente

router.get("/dashboard-admin", autenticadoCookie, (req: any, res: Response, next: any) => {
  if (req.user?.perfil !== "ADMIN") {
    return res.redirect("/pages/naoAutorizado.html");
  }
  next();
}, (_req: Request, res: Response) => {
  res.sendFile("dashboardAdmin.html", { root: "public/pages" });
});

router.get("/gerenciar-monitorias", autenticadoCookie, (req: any, res: Response, next: any) => {
  if (req.user?.perfil !== "ADMIN" && req.user?.perfil !== "MONITOR") {
    return res.redirect("/pages/naoAutorizado.html");
  }
  next();
}, (_req: Request, res: Response) => {
  res.sendFile("gerenciarMonitorias.html", { root: "public/pages" });
});

router.use("/alunos", alunoRoutes);
router.use("/disciplinas" , disciplinaRoutes )
router.use("/locais" , localRoutes )
router.use("/campus" , campusRoutes )
router.use("/monitorias" , monitoriaRoutes )
router.use("/inscricoes" , inscriacaoRoutes)

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout realizado com sucesso" });
});

router.use("/login", loginRoutes);
router.use("/home" , homeRoutes )

export default router;
