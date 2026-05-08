import { getAlunoId } from "../utils/getAlunoId.js";
import { getPerfil } from "../utils/getPerfil.js";
import { getCookie } from "../utils/getCookie.js";

const lista = document.getElementById("listamonitorias");
let todosLocais = [];

function getAuthHeaders() {
    const token = localStorage.getItem("token") || getCookie("token");
    const headers = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

async function carregarCursos() {
    try {
        const response = await fetch("/cursos", {
            headers: getAuthHeaders(),
            credentials: "same-origin",
        });
        const cursos = await response.json();
        const selectCurso = document.getElementById("cursos");
        selectCurso.innerHTML = '<option value="" disabled selected>Selecione o curso...</option>';
        cursos.forEach((curso) => {
            const option = document.createElement("option");
            option.value = curso.id;
            option.textContent = curso.nome;
            selectCurso.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

async function carregarCampus() {
    try {
        const response = await fetch("/campus", {
            headers: getAuthHeaders(),
            credentials: "same-origin",
        });
        const campusList = await response.json();
        const selectCampus = document.getElementById("campus");
        selectCampus.innerHTML = '<option value="" disabled selected>Selecione o campus...</option>';
        campusList.forEach((campus) => {
            const option = document.createElement("option");
            option.value = campus.id;
            option.textContent = campus.nome;
            selectCampus.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

async function carregarTodosLocais() {
    try {
        const response = await fetch("/locais", {
            headers: getAuthHeaders(),
            credentials: "same-origin",
        });
        todosLocais = await response.json();
    } catch (error) {
        console.log(error);
    }
}

async function filtrarDisciplinasPorCurso() {
    const cursoId = document.getElementById("cursos").value;
    const selectDisciplina = document.getElementById("disciplinas");
    selectDisciplina.innerHTML = '<option value="" disabled selected>Selecione...</option>';
    if (!cursoId) return;
    try {
        const response = await fetch(`/disciplinas?cursoId=${cursoId}`, {
            headers: getAuthHeaders(),
            credentials: "same-origin",
        });
        const disciplinas = await response.json();
        disciplinas.forEach((disciplina) => {
            const option = document.createElement("option");
            option.value = disciplina.id;
            option.textContent = disciplina.nome;
            selectDisciplina.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

function filtrarLocaisPorCampus() {
    const campusId = document.getElementById("campus").value;
    const selectLocal = document.getElementById("locais");
    selectLocal.innerHTML = '<option value="" disabled selected>Selecione...</option>';
    if (!campusId) return;
    const locaisFiltrados = todosLocais.filter((l) => l.campusId == campusId);
    locaisFiltrados.forEach((local) => {
        const option = document.createElement("option");
        option.value = local.id;
        option.textContent = local.nome;
        selectLocal.appendChild(option);
    });
}

document.getElementById("cursos")?.addEventListener("change", filtrarDisciplinasPorCurso);
document.getElementById("campus")?.addEventListener("change", filtrarLocaisPorCampus);

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
                <div class="qtdinscricoes" style="color: #1e3a8a;">${qtdInscricoes} ${qtdInscricoes === 1 ? 'Inscrição' : 'Inscrições'}</div>
            </div>
            `;

            // Popup de info
            const popupInfoMonitoria = document.getElementById("popupInfoMonitoria");
            const popupTitulo = document.getElementById("popupTitulo");
            const popupDisciplina = document.getElementById("popupDisciplina");
            const popupMonitor = document.getElementById("popupMonitor");
            const popupLocal = document.getElementById("popupLocal");
            const popupDataHora = document.getElementById("popupDataHora");
            const popupDescricao = document.getElementById("popupDescricao");

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
                popupDescricao.textContent = `Descrição: ${m.descricao || 'Sem descrição'}`;

                popupInfoMonitoria.classList.remove("hidden");
            });

            // Botões de ação
            const divBotao = document.createElement("div");
            divBotao.classList.add("divbotao");

            // Botão detalhes - para qualquer monitor ou admin
            if (perfilUsuario === "MONITOR" || perfilUsuario === "ADMIN") {
                const botaoDetalhes = document.createElement("button");
                botaoDetalhes.textContent = "Detalhes";
                botaoDetalhes.classList.add("btn-detalhes");

                botaoDetalhes.addEventListener("click", async (e) => {
                    e.stopPropagation();

                    const popupDetalhes = document.getElementById("popupDetalhesMonitoria");
                    const titulo = document.getElementById("popupDetalhesTitulo");
                    const descricao = document.getElementById("popupDetalhesDescricao");
                    const listaInscritos = document.getElementById("listaInscritos");

                    titulo.textContent = m.nome_monitoria;
                    descricao.textContent = m.descricao || "Sem descrição";
                    listaInscritos.innerHTML = "<li>Carregando inscritos...</li>";
                    popupDetalhes.classList.remove("hidden");

                    try {
                        const response = await fetch(`/inscricoes/monitoria/${m.id}`, {
                            headers: getAuthHeaders(),
                            credentials: "same-origin"
                        });

                        if (!response.ok) {
                            throw new Error("Erro ao carregar inscritos");
                        }

                        const inscricoes = await response.json();

                        if (inscricoes.length === 0) {
                            listaInscritos.innerHTML = '<li class="sem-inscritos">Nenhum aluno inscrito</li>';
                        } else {
                            listaInscritos.innerHTML = "";
                            inscricoes.forEach((insc) => {
                                const li = document.createElement("li");
                                li.textContent = `${insc.aluno.nome} - ${insc.aluno.matricula}`;
                                listaInscritos.appendChild(li);
                            });
                        }
                    } catch (err) {
                        listaInscritos.innerHTML = `<li class="sem-inscritos">Erro: ${err.message}</li>`;
                    }
                });

                divBotao.appendChild(botaoDetalhes);
            }

            // Botão atualizar - apenas para o dono ou admin
            if (m.monitorId === idUsuario || perfilUsuario === "ADMIN") {
                const botaoUpdate = document.createElement("button");
                botaoUpdate.textContent = "Atualizar Monitoria";
                botaoUpdate.classList.add("btn-update");

                botaoUpdate.addEventListener("click", async (e) => {
                    e.stopPropagation();

                    const formUpdate = document.getElementById("formAtualizarMonitoria");
                    const modalOverlay = document.getElementById("modalOverlay");

                    document.getElementById("id_monitoria_hidden").value = m.id;

                    formUpdate.querySelector('input[name="nome_monitoria"]').value = m.nome_monitoria;
                    formUpdate.querySelector('textarea[name="descricao"]').value = m.descricao;
                    formUpdate.querySelector('input[name="data"]').value = new Date(m.inicio).toISOString().split("T")[0];
                    formUpdate.querySelector('input[name="hora_inicio"]').value = new Date(m.inicio).toTimeString().slice(0, 5);
                    formUpdate.querySelector('input[name="hora_fim"]').value = new Date(m.fim).toTimeString().slice(0, 5);

                    const selectCampus = document.getElementById("campus");
                    const selectLocal = document.getElementById("locais");
                    const selectCurso = document.getElementById("cursos");
                    const selectDisciplina = document.getElementById("disciplinas");

                    const campusId = m.local?.campusId;
                    const cursoId = m.disciplina?.cursos?.[0]?.curso?.id;

                    if (campusId) {
                        selectCampus.value = campusId;
                        filtrarLocaisPorCampus();
                    }

                    if (cursoId) {
                        selectCurso.value = cursoId;
                        await filtrarDisciplinasPorCurso();
                    }

                    selectLocal.value = m.localId;
                    selectDisciplina.value = m.disciplinaId;

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

function marcarErroHorario() {
    const horaInicio = formAtualizar.querySelector('input[name="hora_inicio"]');
    const horaFim = formAtualizar.querySelector('input[name="hora_fim"]');
    horaInicio.classList.add("erro-horario");
    horaFim.classList.add("erro-horario");
}

function limparErroHorario() {
    const horaInicio = formAtualizar.querySelector('input[name="hora_inicio"]');
    const horaFim = formAtualizar.querySelector('input[name="hora_fim"]');
    horaInicio.classList.remove("erro-horario");
    horaFim.classList.remove("erro-horario");
}

// Lógica de atualizar monitoria
const formAtualizar = document.getElementById("formAtualizarMonitoria");
if (formAtualizar) {
    formAtualizar.addEventListener("submit", async (e) => {
        e.preventDefault();
        limparErroHorario();

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
            } else {
                const dadosErro = await response.json().catch(() => ({}));
                const mensagemErro = dadosErro.error || dadosErro.erro || "";
                if (mensagemErro.startsWith("HORARIO_INVALIDO")) {
                    marcarErroHorario();
                }
            }
        } catch (error) {
            console.log(error);
        }
    });

    const horaInicioInput = formAtualizar.querySelector('input[name="hora_inicio"]');
    const horaFimInput = formAtualizar.querySelector('input[name="hora_fim"]');
    if (horaInicioInput) horaInicioInput.addEventListener("input", limparErroHorario);
    if (horaFimInput) horaFimInput.addEventListener("input", limparErroHorario);
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

// Fechar popup de detalhes
const popupDetalhesMonitoria = document.getElementById("popupDetalhesMonitoria");
const btnFecharDetalhes = document.getElementById("btnFecharDetalhes");
if (btnFecharDetalhes) {
    btnFecharDetalhes.addEventListener("click", () => {
        popupDetalhesMonitoria.classList.add("hidden");
    });
}
if (popupDetalhesMonitoria) {
    popupDetalhesMonitoria.addEventListener("click", (e) => {
        if (e.target === popupDetalhesMonitoria) {
            popupDetalhesMonitoria.classList.add("hidden");
        }
    });
}

carregarCampus();
carregarCursos();
carregarTodosLocais();
carregarMonitorias();
