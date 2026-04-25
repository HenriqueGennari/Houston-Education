import { getAlunoId } from "../utils/getAlunoId.js";
import { getPerfil } from "../utils/getPerfil.js";
import { getCookie } from "../utils/getCookie.js";

const lista = document.getElementById("listamonitorias");

function getAuthHeaders() {
    const token = localStorage.getItem("token") || getCookie("token");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

async function carregarMonitorias() {
    const perfilUsuario = getPerfil();
    const idUsuario = getAlunoId();

    try {
        let url;
        if (perfilUsuario === "ADMIN") {
            url = "/monitorias";
        } else {
            url = `/monitorias/monitor/${idUsuario}`;
        }

        const response = await fetch(url, {
            headers: getAuthHeaders(),
            credentials: "same-origin"
        });

        if (!response.ok) {
            throw new Error("ERRO_AO_CARREGAR");
        }

        const monitorias = await response.json();

        if (monitorias.length === 0) {
            lista.innerHTML = "<li>Nenhuma monitoria encontrada!</li>";
            return;
        }

        lista.innerHTML = "";

        monitorias.forEach((m) => {
            const li = document.createElement("li");
            li.classList.add("cardmonitoria");

            const qtdInscricoes = m._count?.inscricoes || 0;

            li.innerHTML = `
            <div class="informacoesmonitoria">
                <div class="nomemonitoria">${m.nome_monitoria}</div>
                <div class="disciplinamonitoria">${m.disciplina.nome}</div>
                <div class="datamonitoria">
                    ${new Date(m.inicio).toLocaleDateString()} -
                    ${new Date(m.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div class="qtdinscricoes" style="color: #1e3a8a;">${qtdInscricoes} inscrição${qtdInscricoes !== 1 ? 'es' : ''}</div>
                <div class="descricaomonitoria">${m.descricao || 'Sem descrição'}</div>
            </div>
            `;

            // Popup de info
            const popupInfoMonitoria = document.getElementById("popupInfoMonitoria");
            const popupTitulo = document.getElementById("popupTitulo");
            const popupDisciplina = document.getElementById("popupDisciplina");
            const popupMonitor = document.getElementById("popupMonitor");
            const popupLocal = document.getElementById("popupLocal");
            const popupDataHora = document.getElementById("popupDataHora");

            popupInfoMonitoria.addEventListener("click", (e) => {
                if (e.target === popupInfoMonitoria) popupInfoMonitoria.classList.add("hidden");
            });

            li.addEventListener("click", (e) => {
                if (e.target.tagName.toLowerCase() === "button") return;

                popupTitulo.textContent = m.nome_monitoria;
                popupDisciplina.textContent = `Disciplina: ${m.disciplina.nome}`;
                popupMonitor.textContent = `Monitor: ${m.monitor.nome}`;
                popupLocal.textContent = `Local: ${m.local?.nome || 'Não informado'}`;
                popupDataHora.textContent = `Data/Hora: ${new Date(m.inicio).toLocaleDateString()} - ${new Date(m.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                const popupDescricao = document.getElementById("popupDescricao");
                if (popupDescricao) popupDescricao.textContent = `Descrição: ${m.descricao || 'Sem descrição'}`;

                popupInfoMonitoria.classList.remove("hidden");
            });

            // Botões de ação
            const divBotao = document.createElement("div");
            divBotao.classList.add("divbotao");

            // Botão atualizar - apenas para o dono ou admin
            if (m.monitorId === idUsuario || perfilUsuario === "ADMIN") {
                const botaoUpdate = document.createElement("button");
                botaoUpdate.textContent = "Atualizar Monitoria";
                botaoUpdate.classList.add("btn-update");

                botaoUpdate.addEventListener("click", (e) => {
                    e.stopPropagation();

                    const formUpdate = document.getElementById("formAtualizarMonitoria");
                    const modalOverlay = document.getElementById("modalOverlay");

                    document.getElementById("id_monitoria_hidden").value = m.id;

                    formUpdate.querySelector('input[name="nome_monitoria"]').value = m.nome_monitoria;
                    formUpdate.querySelector('input[name="data"]').value = new Date(m.inicio).toISOString().split("T")[0];
                    formUpdate.querySelector('input[name="hora_inicio"]').value = new Date(m.inicio).toTimeString().slice(0, 5);
                    formUpdate.querySelector('input[name="hora_fim"]').value = new Date(m.fim).toTimeString().slice(0, 5);
                    formUpdate.querySelector('select[name="localId"]').value = m.localId;
                    formUpdate.querySelector('select[name="disciplinaId"]').value = m.disciplinaId;

                    modalOverlay.classList.add("open");
                });

                divBotao.appendChild(botaoUpdate);
            }

            li.appendChild(divBotao);
            lista.appendChild(li);
        });

        // Busca
        const buscarMonitoria = document.getElementById("buscaMonitoria");
        if (buscarMonitoria) {
            const filtrar = () => {
                const termo = buscarMonitoria.value.toLowerCase();
                document.querySelectorAll(".cardmonitoria").forEach(card => {
                    const nomeMonitoria = card.querySelector(".nomemonitoria").textContent.toLowerCase();
                    card.style.display = nomeMonitoria.includes(termo) ? "" : "none";
                });
            };
            buscarMonitoria.addEventListener("input", filtrar);
        }

    } catch (err) {
        lista.innerHTML = `<li>Erro ao carregar monitorias: ${err.message}</li>`;
    }
}

// === Listeners globais (fora de carregarMonitorias) ===

// Lógica de atualizar monitoria
const formAtualizar = document.getElementById("formAtualizarMonitoria");
if (formAtualizar) {
    formAtualizar.addEventListener("submit", async (e) => {
        e.preventDefault();

        const idMonitoria = document.getElementById("id_monitoria_hidden").value;
        const formData = new FormData(formAtualizar);
        const dadosParaAtualizar = Object.fromEntries(formData);

        delete dadosParaAtualizar.id_monitoria;

        try {
            const response = await fetch(`/monitorias/${idMonitoria}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders()
                },
                credentials: "same-origin",
                body: JSON.stringify(dadosParaAtualizar)
            });

            if (response.ok) {
                const popupSucesso = document.getElementById("popupSucessoAtualizar");
                popupSucesso.classList.remove("hidden");
                const modalOverlay = document.getElementById("modalOverlay");
                modalOverlay.classList.remove("open");
                formAtualizar.reset();
                carregarMonitorias();
            }
        } catch (error) {
            console.log(error);
        }
    });
}

// Fechar popup de sucesso
const btnFecharPopupSucesso = document.getElementById("btnFecharPopupSucesso");
const popupSucessoAtualizar = document.getElementById("popupSucessoAtualizar");
if (btnFecharPopupSucesso) {
    btnFecharPopupSucesso.addEventListener("click", () => {
        popupSucessoAtualizar.classList.add("hidden");
    });
}
if (popupSucessoAtualizar) {
    popupSucessoAtualizar.addEventListener("click", (e) => {
        if (e.target === popupSucessoAtualizar) {
            popupSucessoAtualizar.classList.add("hidden");
        }
    });
}

// Fechar modal
const modalOverlay = document.getElementById("modalOverlay");
const btnFecharModal = document.querySelector(".close-btn");

const fecharModal = () => {
    if (modalOverlay) modalOverlay.classList.remove("open");
};

if (btnFecharModal) {
    btnFecharModal.addEventListener("click", fecharModal);
}

carregarMonitorias();
