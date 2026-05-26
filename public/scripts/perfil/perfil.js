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

// Modal de senha
const modalSenha = document.getElementById("modalSenha");
const btnAbrirModalSenha = document.getElementById("btnAbrirModalSenha");
const btnCancelarSenha = document.getElementById("btnCancelarSenha");
const formSenha = document.getElementById("formSenha");
const novaSenhaInput = document.getElementById("novaSenha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");

btnAbrirModalSenha?.addEventListener("click", () => {
    modalSenha.classList.remove("hidden");
    novaSenhaInput.focus();
});

btnCancelarSenha?.addEventListener("click", () => {
    modalSenha.classList.add("hidden");
    formSenha.reset();
});

modalSenha?.querySelector(".modal-senha-overlay")?.addEventListener("click", () => {
    modalSenha.classList.add("hidden");
    formSenha.reset();
});

// Toggle olhinho nos campos de senha
document.querySelectorAll(".btn-toggle-senha").forEach((btn) => {
    btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const input = document.getElementById(targetId);
        const icone = btn.querySelector("i");

        if (input.type === "password") {
            input.type = "text";
            icone.classList.remove("ph-eye");
            icone.classList.add("ph-eye-slash");
        } else {
            input.type = "password";
            icone.classList.remove("ph-eye-slash");
            icone.classList.add("ph-eye");
        }
    });
});

formSenha?.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!userId) {
        alert("Erro: usuario nao identificado");
        return;
    }

    const novaSenha = novaSenhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;

    if (novaSenha !== confirmarSenha) {
        novaSenhaInput.classList.add("input-erro");
        confirmarSenhaInput.classList.add("input-erro");

        setTimeout(() => {
            novaSenhaInput.classList.remove("input-erro");
            confirmarSenhaInput.classList.remove("input-erro");
        }, 2000);

        return;
    }

    try {
        const response = await fetch(`/alunos/${userId}/senha`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...getAuthHeaders()
            },
            credentials: "same-origin",
            body: JSON.stringify({ senha: novaSenha })
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || erro.erro || "Erro ao alterar senha");
        }

        modalSenha.classList.add("hidden");
        formSenha.reset();

        const popup = document.getElementById("popupSucesso");
        popup.querySelector("p").textContent = "Senha alterada com sucesso!";
        popup.classList.remove("hidden");

        setTimeout(() => {
            popup.classList.add("hidden");
        }, 3000);
    } catch (err) {
        alert(err.message);
    }
});

carregarDadosPerfil();
