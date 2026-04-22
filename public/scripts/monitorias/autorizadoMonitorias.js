import { parseJwt } from "../utils/parseJWT.js";

// colocando na home para impedir o acesso direto do link ( clicar direto no link invés de abrir uma nova janela)
document.getElementById("linkCadastrarMonitoria").addEventListener("click", (e) => {
  e.preventDefault();

  const user = parseJwt(localStorage.getItem('token'))
  if (user.perfil !== "MONITOR" && user.perfil !== "ADMIN"){
    window.location.href = "naoAutorizado.html";
  } else {
    window.location.href = "cadastrarMonitoria.html";
  }
});
