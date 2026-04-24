import dotenv from "dotenv"
import path from "path";
import routes from "./routes/index.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



dotenv.config();
const server = express();

/*server.use(cors({
  origin: "https://projetointegeradormonitoria.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE"]
}));*/



server.use(cors({
  origin: ["https://projetointegeradormonitoria.onrender.com", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

server.use(express.json());
server.use(express.urlencoded({extended : true}));
server.use(cookieParser());
server.use(express.static(path.join(process.cwd(), "public"))); // criando um caminho direto para a pasta public, o current working directory pega a raiz e faz o caminho

server.use(routes);


const PORT = Number(process.env.PORT) || 3000;

server.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});

// meu server.ts está responsável por: usar cors, instanciar o servidor e usar as rotas do routes