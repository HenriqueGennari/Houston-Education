import { parseJwt } from "../utils/parseJWT.js";

const API_URL = "http://localhost:3000";
let monitoriasCache = [];

async function carregarHistorico() {
    const tbody = document.getElementById("corpoTabelaHistorico");
    const token = localStorage.getItem("token");
    const user = parseJwt(token);

    if (!user?.id) {
        tbody.innerHTML = `<tr><td colspan="7" class="sem-dados">Usuário não autenticado</td></tr>`;
        return;
    }

    const url = user.perfil === "ADMIN"
        ? `${API_URL}/monitorias/historico`
        : `${API_URL}/monitorias/historico/${user.id}`;

    try {
        const resposta = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!resposta.ok) throw new Error("Erro ao carregar histórico");

        const monitorias = await resposta.json();
        monitoriasCache = monitorias;
        ordenarMonitorias();
        popularFiltroDisciplinas(monitorias);
    } catch (erro) {
        console.warn("Usando dados mock:", erro.message);
        const mock = [
            {
                nome: "Teste 2",
                disciplina: { nome: "Matemática" },
                data: "2026-07-31",
                inicio: "12:00",
                fim: "14:00",
                inscritos: 3,
                presentes: 2,
                temChamada: true,
            },
            {
                nome: "Monitoria de Física",
                disciplina: { nome: "Física I" },
                data: "2026-07-28",
                inicio: "10:00",
                fim: "12:00",
                inscritos: 8,
                presentes: 5,
                temChamada: true,
            },
            {
                nome: "Revisão de Cálculo",
                disciplina: { nome: "Cálculo II" },
                data: "2026-07-25",
                inicio: "08:00",
                fim: "10:00",
                inscritos: 6,
                presentes: 0,
                temChamada: false,
            },
        ];
        monitoriasCache = mock;
        ordenarMonitorias();
        popularFiltroDisciplinas(mock);
    }
}

function formatarData(dataString) {
    const [ano, mes, dia] = dataString.split("-");
    return `${dia}/${mes}/${ano}`;
}

function renderizarTabela(monitorias) {
    const tbody = document.getElementById("corpoTabelaHistorico");

    if (!monitorias || monitorias.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="sem-dados">Nenhuma monitoria encontrada</td></tr>`;
        return;
    }

    tbody.innerHTML = monitorias
        .map((m) => {
            const presentesClasse =
                m.presentes > 0 ? "presentes-positivo" : "presentes-zero";
            const acao = m.temChamada
                ? `<button class="btn-ver-chamada" data-id="${m.id || 0}">Ver chamada</button>`
                : `<span class="sem-chamada">Sem chamada</span>`;

            return `
            <tr>
                <td>${m.nome}</td>
                <td>${m.disciplina?.nome || "-"}</td>
                <td>${formatarData(m.data)}</td>
                <td>${m.inicio} – ${m.fim}</td>
                <td>${m.inscritos}</td>
                <td class="${presentesClasse}">${m.presentes}</td>
                <td>${acao}</td>
            </tr>
        `;
        })
        .join("");

    document.querySelectorAll(".btn-ver-chamada").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const linha = btn.closest("tr");
            const colunas = linha.querySelectorAll("td");
            const nomeMonitoria = colunas[0].textContent;
            const dataMonitoria = colunas[2].textContent;
            abrirModalChamada(id, nomeMonitoria, dataMonitoria);
        });
    });
}

function popularFiltroDisciplinas(monitorias) {
    const select = document.getElementById("filtroDisciplina");
    const disciplinas = [
        ...new Set(monitorias.map((m) => m.disciplina?.nome).filter(Boolean)),
    ];

    disciplinas.forEach((d) => {
        const option = document.createElement("option");
        option.value = d;
        option.textContent = d;
        select.appendChild(option);
    });
}

function filtrarMonitorias() {
    const busca = document.getElementById("buscaMonitoria").value.toLowerCase();
    const disciplina = document.getElementById("filtroDisciplina").value;
    const dataInicial = document.getElementById("dataInicial").value;
    const dataFinal = document.getElementById("dataFinal").value;

    const linhas = document.querySelectorAll("#corpoTabelaHistorico tr");

    linhas.forEach((linha) => {
        const colunas = linha.querySelectorAll("td");
        if (colunas.length < 7) return;

        const nome = colunas[0].textContent.toLowerCase();
        const disc = colunas[1].textContent;
        const dataTexto = colunas[2].textContent;
        const [dia, mes, ano] = dataTexto.split("/");
        const dataISO = `${ano}-${mes}-${dia}`;

        const matchBusca = nome.includes(busca);
        const matchDisciplina = !disciplina || disc === disciplina;
        const matchDataInicial = !dataInicial || dataISO >= dataInicial;
        const matchDataFinal = !dataFinal || dataISO <= dataFinal;

        linha.style.display =
            matchBusca && matchDisciplina && matchDataInicial && matchDataFinal
                ? ""
                : "none";
    });
}

document.getElementById("buscaMonitoria")?.addEventListener("input", filtrarMonitorias);
document.getElementById("filtroDisciplina")?.addEventListener("change", filtrarMonitorias);
document.getElementById("dataInicial")?.addEventListener("change", filtrarMonitorias);
document.getElementById("dataFinal")?.addEventListener("change", filtrarMonitorias);
document.getElementById("ordenarMonitorias")?.addEventListener("change", ordenarMonitorias);

function ordenarMonitorias() {
    if (!monitoriasCache || monitoriasCache.length === 0) return;

    const ordenacao = document.getElementById("ordenarMonitorias")?.value || "recente";

    const ordenado = [...monitoriasCache].sort((a, b) => {
        const dataA = new Date(a.data).getTime();
        const dataB = new Date(b.data).getTime();
        return ordenacao === "recente" ? dataB - dataA : dataA - dataB;
    });

    renderizarTabela(ordenado);
    filtrarMonitorias();
}

const modalChamada = document.getElementById("modalChamada");
const btnFecharModal = document.getElementById("btnFecharModal");
const btnBaixarPdf = document.getElementById("btnBaixarPdf");

async function abrirModalChamada(id, nomeMonitoria, dataMonitoria) {
    document.getElementById("modalChamadaTitulo").textContent = `Chamada - ${nomeMonitoria} - ${dataMonitoria}`;

    const token = localStorage.getItem("token");
    const container = document.getElementById("modalChamadaLista");
    container.innerHTML = `<div class="sem-alunos">Carregando...</div>`;
    modalChamada.classList.add("open");

    try {
        const resposta = await fetch(`${API_URL}/monitorias/${id}/chamada`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!resposta.ok) {
            if (resposta.status === 403) {
                container.innerHTML = `<div class="sem-alunos">Você não tem permissão para visualizar esta chamada.</div>`;
                return;
            }
            if (resposta.status === 404) {
                container.innerHTML = `<div class="sem-alunos">Monitoria não encontrada.</div>`;
                return;
            }
            throw new Error("Erro ao carregar chamada");
        }

        const alunos = await resposta.json();
        const alunosFormatados = alunos.map(a => ({
            nome: a.nome,
            matricula: a.matricula,
            inscrito: "Sim",
            presente: a.presente,
        }));

        renderizarListaChamada(alunosFormatados);
    } catch (erro) {
        container.innerHTML = `<div class="sem-alunos">Erro ao carregar chamada. Tente novamente.</div>`;
    }
}

function fecharModalChamada() {
    modalChamada.classList.remove("open");
}

function renderizarListaChamada(alunos) {
    const container = document.getElementById("modalChamadaLista");

    if (!alunos || alunos.length === 0) {
        container.innerHTML = `<div class="sem-alunos">Nenhum aluno inscrito nesta monitoria</div>`;
        return;
    }

    container.innerHTML = alunos.map(aluno => `
        <div class="chamada-aluno">
            <div class="chamada-aluno-info">
                <span class="chamada-aluno-nome">${aluno.nome}</span>
                <span class="chamada-aluno-matricula">Matrícula: ${aluno.matricula}</span>
                <span class="chamada-aluno-inscrito">Inscrito: ${aluno.inscrito}</span>
            </div>
            <span class="chamada-aluno-status ${aluno.presente ? 'status-presente' : 'status-ausente'}">
                ${aluno.presente ? 'Presente' : 'Ausente'}
            </span>
        </div>
    `).join("");
}

btnFecharModal?.addEventListener("click", fecharModalChamada);
btnBaixarPdf?.addEventListener("click", () => {
    alert("Download do PDF em desenvolvimento");
});

modalChamada?.addEventListener("click", (e) => {
    if (e.target === modalChamada) {
        fecharModalChamada();
    }
});

carregarHistorico();