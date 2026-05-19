import { parseJwt } from "../utils/parseJWT.js";

const API_URL = "http://localhost:3000";

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
        renderizarTabela(monitorias);
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
        renderizarTabela(mock);
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
            alert("Visualização da chamada em desenvolvimento");
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

carregarHistorico();