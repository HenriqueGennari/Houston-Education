import { getAuthHeaders } from "../utils/getAuthHeaders.js";
import { parseJwt } from "../utils/parseJWT.js";

const formPerfil = document.getElementById("formPerfil");
const nomeInput = document.getElementById("nomeCompleto");
const emailInput = document.getElementById("email");
const matriculaInput = document.getElementById("matricula");

let userId = "";

function carregarDadosPerfil() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = parseJwt(token);
    if (!decoded) return;

    userId = decoded.id || "";
    nomeInput.value = decoded.nome || "";
    emailInput.value = decoded.email || "";
    matriculaInput.value = decoded.matricula || "";
}

formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!userId) {
        alert("Erro: usuario nao identificado");
        return;
    }

    const matricula = matriculaInput.value.trim();
    const matriculaRegex = /^\d{8,11}$/;
    if (matricula && !matriculaRegex.test(matricula)) {
        alert("A matrícula deve conter entre 8 e 11 dígitos numéricos.");
        return;
    }

    const dados = {
        nome: nomeInput.value,
        email: emailInput.value,
        matricula: matricula
    };

    try {
        const response = await fetch(`/alunos/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            credentials: "same-origin",
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || erro.erro || "Erro ao atualizar perfil");
        }

        const popup = document.getElementById("popupSucesso");
        popup.classList.remove("hidden");

        setTimeout(() => {
            popup.classList.add("hidden");
        }, 3000);
    } catch (err) {
        alert(err.message);
    }
});

document.getElementById("btnFecharPopup")?.addEventListener("click", () => {
    document.getElementById("popupSucesso").classList.add("hidden");
});

document.getElementById("btnCancelar")?.addEventListener("click", () => {
    carregarDadosPerfil();
});

carregarDadosPerfil();
