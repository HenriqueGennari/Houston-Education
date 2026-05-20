const API_URL = "http://localhost:3000";

// Dados mock para visualização (serão substituídos pelo backend futuramente)
const inscricoesMock = [
    {
        id: "1",
        nome: "Monitoria de Lógica de Programação",
        data: "30/05/2026",
        disciplina: "Banco de dados",
        monitor: "Monitor Paulo",
        local: "Sala 160 — Taguatinga",
        dataHora: "30/05/2026 - 07:00",
        descricao: "Sem descrição",
    },
    {
        id: "2",
        nome: "Monitoria de Cálculo I",
        data: "15/06/2026",
        disciplina: "Cálculo",
        monitor: "Ana Carolina",
        local: "Laboratório 3 — Taguatinga",
        dataHora: "15/06/2026 - 14:00",
        descricao: "Revisão para a P2. Trazam exercícios resolvidos.",
    },
    {
        id: "3",
        nome: "Monitoria de Banco de Dados",
        data: "20/06/2026",
        disciplina: "Banco de Dados",
        monitor: "Carlos Eduardo",
        local: "Sala 205 — Taguatinga",
        dataHora: "20/06/2026 - 10:00",
        descricao: "Modelagem ER e normalização.",
    },
];

function carregarInscricoes() {
    const container = document.getElementById("listaInscricoes");

    // TODO: Substituir por chamada real ao backend
    // const token = localStorage.getItem("token");
    // const resposta = await fetch(`${API_URL}/inscricoes/minhas`, { ... });

    const inscricoes = inscricoesMock;

    if (!inscricoes || inscricoes.length === 0) {
        container.innerHTML = `<div class="sem-inscricoes">Você ainda não está inscrito em nenhuma monitoria.</div>`;
        return;
    }

    container.innerHTML = inscricoes.map((inscricao) => `
        <div class="inscricao-card" data-id="${inscricao.id}">
            <div class="inscricao-card-titulo">${inscricao.nome}</div>
            <div class="inscricao-card-data">
                <i class="ph ph-calendar"></i>
                <span>${inscricao.data}</span>
            </div>
            <button class="btn-detalhes" data-id="${inscricao.id}">Detalhes</button>
        </div>
    `).join("");

    document.querySelectorAll(".btn-detalhes").forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const inscricao = inscricoes.find((i) => i.id === id);
            if (inscricao) {
                abrirModalDetalhes(inscricao);
            }
        });
    });
}

const modalDetalhes = document.getElementById("modalDetalhes");
const btnFecharModal = document.getElementById("btnFecharModal");

function abrirModalDetalhes(inscricao) {
    document.getElementById("modalDetalhesTitulo").textContent = inscricao.nome;
    document.getElementById("detalheDisciplina").textContent = inscricao.disciplina;
    document.getElementById("detalheMonitor").textContent = inscricao.monitor;
    document.getElementById("detalheLocal").textContent = inscricao.local;
    document.getElementById("detalheDataHora").textContent = inscricao.dataHora;
    document.getElementById("detalheDescricao").textContent = inscricao.descricao || "Sem descrição";

    modalDetalhes.classList.add("open");
}

function fecharModalDetalhes() {
    modalDetalhes.classList.remove("open");
}

btnFecharModal?.addEventListener("click", fecharModalDetalhes);

modalDetalhes?.addEventListener("click", (e) => {
    if (e.target === modalDetalhes) {
        fecharModalDetalhes();
    }
});

carregarInscricoes();
