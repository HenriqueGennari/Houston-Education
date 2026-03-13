import { getAlunoId } from "../utils/getAlunoId.js";
import { getPerfil } from "../utils/getPerfil.js";
const form = document.getElementById("monitoriaForm");
const mensagem = document.getElementById("mensagem");

form.addEventListener("submit", async (evento)=>{
    evento.preventDefault();

    const idUsuario = getAlunoId();
    const perfilUsuario = getPerfil()

    const dadosForm = new FormData(form)
    const dados = Object.fromEntries(dadosForm)

    if(!dados.nome_monitoria || !dados.data || !dados.hora_inicio || !dados.hora_fim || !dados.local || !dados.disciplinaId || !dados.monitorId){
        mensagem.textContent = "Preencha todos os campos.";
        mensagem.style.color = "red";
        return;
    }


    if(dados.monitorId !== idUsuario && perfilUsuario !== "ADMIN"){
        mensagem.textContent = "Você não pode criar monitorias para outros!"
        return;
    } // validação para que um monitor só crie monitorias para ele mesmo 
        
    try {
        const response = await fetch("/monitorias", {
            method : "POST",
            headers : {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            body : JSON.stringify(dados)
        })

        if (!response.ok){
            mensagem.textContent = "Erro ao criar monitoria. Verifique a data";
            mensagem.style.color = "red";
            return;
        }

        mensagem.innerHTML = 'Monitoria cadastrada com sucesso!<a href="    home.html">Ver</a>'
        mensagem.style.color = "blue"
        form.reset(); // limpar os inputs 


    } catch (error) {
        mensagem.textContent = "Erro inesperado ao enviar os dados.";
        mensagem.style.color = "red";
    }
})

