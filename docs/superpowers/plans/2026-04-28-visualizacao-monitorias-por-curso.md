# Visualizacao de Monitorias Agrupadas por Curso - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agrupar as monitorias na home por curso, mantendo os cards internos inalterados.

**Architecture:** Adicionar entidade `Curso` no Prisma schema com relacao para `Disciplina`. Atualizar a query de monitorias para incluir `disciplina.curso`. No frontend, agrupar as monitorias por `disciplina.curso.nome` e renderizar um container de curso para cada grupo.

**Tech Stack:** Prisma, TypeScript, Express, vanilla JS, CSS

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `prisma/schema.prisma` | Modify | Add `Curso` model; add `cursoId` to `Disciplina` |
| `prisma/migrations/20260428_add_curso/` | Create | Migration SQL for Curso table and cursoId FK |
| `src/repositories/Prisma/MonitoriaPrismaRepository.ts` | Modify | Include `disciplina.curso` in `getDisponiveis()` |
| `public/style/style.css` | Modify | Add `.curso-container`, `.curso-header`, `.curso-monitorias` styles |
| `public/scripts/monitorias/carregarMonitorias.js` | Modify | Group monitorias by curso; render curso containers |

---

### Task 1: Adicionar modelo Curso no schema Prisma

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1: Add Curso model and update Disciplina**

  Add the `Curso` model above `Disciplina`, and add `cursoId` + relation to `Disciplina`:

  ```prisma
  model Curso {
    id          Int         @id @default(autoincrement())
    nome        String
    sigla       String?
    descricao   String?
    disciplinas Disciplina[]

    @@map("curso")
  }

  model Disciplina {
    id        Int     @id @default(autoincrement())
    nome      String
    descricao String?
    cursoId   Int
    curso     Curso   @relation(fields: [cursoId], references: [id])

    monitorias Monitoria[]

    @@map("disciplina")
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add prisma/schema.prisma
  git commit -m "feat(schema): add Curso model and cursoId on Disciplina"
  ```

---

### Task 2: Criar migration para Curso

**Files:**
- Create: `prisma/migrations/20260428120000_add_curso/migration.sql`

- [ ] **Step 1: Write migration SQL**

  ```sql
  -- CreateTable
  CREATE TABLE "curso" (
      "id" SERIAL NOT NULL,
      "nome" TEXT NOT NULL,
      "sigla" TEXT,
      "descricao" TEXT,

      CONSTRAINT "curso_pkey" PRIMARY KEY ("id")
  );

  -- Insert default cursos
  INSERT INTO "curso" ("nome", "sigla") VALUES
  ('Ciência da Computação', 'CC'),
  ('Arquitetura', 'AR'),
  ('Direito', 'DR');

  -- Add cursoId to disciplina with default 1
  ALTER TABLE "disciplina" ADD COLUMN "cursoId" INTEGER NOT NULL DEFAULT 1;

  -- AddForeignKey
  ALTER TABLE "disciplina" ADD CONSTRAINT "disciplina_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

  -- DropDefault
  ALTER TABLE "disciplina" ALTER COLUMN "cursoId" DROP DEFAULT;
  ```

- [ ] **Step 2: Apply migration and regenerate Prisma Client**

  ```bash
  npx prisma migrate resolve --applied 20260428120000_add_curso
  ```
  If the above fails because the migration is not recorded, instead run:
  ```bash
  npx prisma migrate dev --name add_curso --create-only
  ```
  Then manually replace the generated migration with the SQL above, and run:
  ```bash
  npx prisma migrate deploy
  npx prisma generate
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add prisma/migrations/
  git commit -m "feat(migration): add curso table and cursoId on disciplina"
  ```

---

### Task 3: Atualizar repository para incluir curso nos dados

**Files:**
- Modify: `src/repositories/Prisma/MonitoriaPrismaRepository.ts:39-76`

- [ ] **Step 1: Update `getDisponiveis()` include block**

  Change the `disciplina` select to also include `curso`:

  ```typescript
  async getDisponiveis(): Promise<any[]> {
    const dadosMonitoria = await prisma.monitoria.findMany({
      where: {
        fim: {
          gte: new Date(),
        },
      },
      include: {
        disciplina: {
          select: {
            descricao: true,
            nome: true,
            curso: {
              select: {
                id: true,
                nome: true,
                sigla: true,
              },
            },
          },
        },
        monitor: {
          select: {
            nome: true,
          },
        },
        local: {
          select: {
            nome: true,
            campus: {
              select: {
                nome: true,
              },
            },
          },
        },
        _count: {
          select: {
            inscricoes: true,
          },
        },
      },
    });
    return dadosMonitoria;
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/repositories/Prisma/MonitoriaPrismaRepository.ts
  git commit -m "feat(repository): include curso in getDisponiveis response"
  ```

---

### Task 4: Adicionar CSS do container de curso

**Files:**
- Modify: `public/style/style.css`

- [ ] **Step 1: Add curso container styles before `#listamonitorias`**

  Insert after `.sectionmonitorias { ... }` block and before `#listamonitorias`:

  ```css
  /* Container de Curso */
  .curso-container {
    border: 1px solid #024059;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    background: #fff;
  }

  .curso-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }

  .curso-sigla {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #024059, #035a7d);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.85rem;
  }

  .curso-nome {
    font-weight: bold;
    color: #024059;
    font-size: 1.1rem;
  }

  .curso-monitorias {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  @media (max-width: 900px) {
    .curso-monitorias {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 600px) {
    .curso-monitorias {
      grid-template-columns: 1fr;
    }
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add public/style/style.css
  git commit -m "feat(css): add curso container styles"
  ```

---

### Task 5: Modificar carregarMonitorias.js para agrupar por curso

**Files:**
- Modify: `public/scripts/monitorias/carregarMonitorias.js`

- [ ] **Step 1: Refactor render loop to group by curso**

  In `carregarMonitorias()`, replace the section that clears `lista.innerHTML` and loops `monitorias.forEach((m) => { ... })` with:

  ```javascript
  // Agrupar monitorias por curso
  const monitoriasPorCurso = {};
  monitorias.forEach((m) => {
    const cursoNome = m.disciplina?.curso?.nome || "Sem curso";
    const cursoSigla = m.disciplina?.curso?.sigla || "?";
    if (!monitoriasPorCurso[cursoNome]) {
      monitoriasPorCurso[cursoNome] = { sigla: cursoSigla, monitorias: [] };
    }
    monitoriasPorCurso[cursoNome].monitorias.push(m);
  });

  // Renderizar cada curso
  Object.entries(monitoriasPorCurso).forEach(([cursoNome, cursoData]) => {
    const cursoContainer = document.createElement("div");
    cursoContainer.classList.add("curso-container");

    const cursoHeader = document.createElement("div");
    cursoHeader.classList.add("curso-header");
    cursoHeader.innerHTML = `
      <div class="curso-sigla">${cursoData.sigla}</div>
      <div class="curso-nome">${cursoNome}</div>
    `;
    cursoContainer.appendChild(cursoHeader);

    const cursoMonitorias = document.createElement("div");
    cursoMonitorias.classList.add("curso-monitorias");

    cursoData.monitorias.forEach((m) => {
      // ==== INICIO: card de monitoria (codigo existente, inalterado) ====
      const li = document.createElement("li");
      li.classList.add("cardmonitoria");
      li.dataset.campus = m.local?.campus?.nome || "";

      li.innerHTML = `
      <div class="informacoesmonitoria">
          <div class="nomemonitoria">${m.nome_monitoria}</div>
          <div class="disciplinamonitoria">${m.disciplina.nome}</div>
          <div class="datamonitoria">
                  ${new Date(m.inicio).toLocaleDateString()} -
                  ${new Date(m.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div class="campusmonitoria">${m.local?.campus?.nome || ''}</div>
      </div>
      `;

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
          popupLocal.textContent = `Local: ${m.local?.nome || 'Não informado'} (${m.local?.campus?.nome || ''})`;
          popupDataHora.textContent = `Data/Hora: ${new Date(m.inicio).toLocaleDateString()} - ${new Date(m.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

          popupInfoMonitoria.classList.remove("hidden");
      });

      const divBotao = document.createElement("div");
      divBotao.classList.add("divbotao");
      const botaoInscrever = document.createElement("button");
      botaoInscrever.dataset.id = m.id;

      const jaInscrito = inscricoes.find((i) => i.monitoriaId === m.id);

      if (jaInscrito) {
          botaoInscrever.textContent = "Inscrito";
          botaoInscrever.classList.add("btn-inscrito");
          botaoInscrever.dataset.inscricaoId = jaInscrito.id;
      } else {
          botaoInscrever.textContent = "Inscreva-se";
          botaoInscrever.classList.add("btn-inscrever");
      }

      divBotao.appendChild(botaoInscrever);
      li.appendChild(divBotao);

      botaoInscrever.addEventListener("click", async () => {
          const alunoId = getAlunoId();

          if (botaoInscrever.classList.contains("btn-inscrito")) {
              popup.classList.remove("hidden");
              popup.dataset.targetButtonId = m.id;
              return;
          }
          try {
              const responseFazerInscricao = await fetch(`/inscricoes`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                      ...getAuthHeaders()
                  },
                  credentials: "same-origin",
                  body: JSON.stringify({ alunoId: alunoId, monitoriaId: m.id })
              });

              if (!responseFazerInscricao.ok) {
                  throw new Error("ERRO_AO_FAZER_INSCRICAO");
              }

              const dadosDaInscricao = await responseFazerInscricao.json();

              botaoInscrever.textContent = "Inscrito";
              botaoInscrever.classList.remove("btn-inscrever");
              botaoInscrever.classList.add("btn-inscrito");
              botaoInscrever.dataset.inscricaoId = dadosDaInscricao.id;
          } catch (err) {
              lista.innerHTML = `<li>Erro ao carregar inscrição: ${err.message}</li>`;
          }
      });

      const idDoUsuario = getAlunoId();
      const perfilDoUsuario = getPerfil();

      if (m.monitorId == idDoUsuario || perfilDoUsuario == "ADMIN") {
          const botaoUpdate = document.createElement("button");
          botaoUpdate.textContent = "Atualizar Monitoria";
          botaoUpdate.classList.add("btn-update");

          botaoUpdate.addEventListener("click", (e) => {
              e.stopPropagation();

              const formUpdate = document.getElementById("formAtualizarMonitoria");
              const modalOverlay = document.getElementById("modalOverlay");

              document.getElementById("id_monitoria_hidden").value = m.id;

              formUpdate.querySelector('input[name="nome_monitoria"]').value = m.nome_monitoria;
              formUpdate.querySelector('input[name="descricao"]').value = m.descricao;
              formUpdate.querySelector('input[name="data"]').value = new Date(m.inicio).toISOString().split("T")[0];
              formUpdate.querySelector('input[name="hora_inicio"]').value = new Date(m.inicio).toTimeString().slice(0, 5);
              formUpdate.querySelector('input[name="hora_fim"]').value = new Date(m.fim).toTimeString().slice(0, 5);
              formUpdate.querySelector('select[name="localId"]').value = m.localId;
              formUpdate.querySelector('select[name="disciplinaId"]').value = m.disciplinaId;

              modalOverlay.classList.add("open");
          });

          divBotao.appendChild(botaoUpdate);
      }

      cursoMonitorias.appendChild(li);
      // ==== FIM: card de monitoria (codigo existente, inalterado) ====
    });

    cursoContainer.appendChild(cursoMonitorias);
    lista.appendChild(cursoContainer);
  });
  ```

  **Note:** The `lista` element (`#listamonitorias`) now contains `.curso-container` divs instead of direct `li.cardmonitoria` children. The CSS grid on `#listamonitorias` should be removed or adjusted — the grid is now on `.curso-monitorias` inside each curso.

- [ ] **Step 2: Update `#listamonitorias` CSS from grid to block**

  In `public/style/style.css`, change `#listamonitorias` to display as block:

  ```css
  #listamonitorias {
    display: block;
    list-style: none;
    padding: 0;
  }
  ```

  Remove or comment out the `grid-template-columns` and `gap` properties.

- [ ] **Step 3: Commit**

  ```bash
  git add public/scripts/monitorias/carregarMonitorias.js public/style/style.css
  git commit -m "feat(home): group monitorias by curso in cards"
  ```

---

### Task 6: Testar visualizacao por campus ainda funciona

- [ ] **Step 1: Verificar que `filtrarPorCampus` ainda funciona**

  The `filtrarPorCampus` function uses `document.querySelectorAll(".cardmonitoria")` and checks `card.dataset.campus`. Since `.cardmonitoria` elements still exist (now nested inside `.curso-container`), this function should continue to work.

  However, empty curso containers (where all monitorias are hidden) will still be visible. To fix this, add logic to hide empty curso containers:

  ```javascript
  function filtrarPorCampus(campusNome) {
    const cards = document.querySelectorAll(".cardmonitoria");
    cards.forEach(card => {
        const cardCampus = card.dataset.campus;
        const deveMostrar = campusNome === "todas" || cardCampus === campusNome;
        if (deveMostrar) {
            card.classList.remove("tab-hidden");
        } else {
            card.classList.add("tab-hidden");
        }
    });

    // Hide empty curso containers
    document.querySelectorAll(".curso-container").forEach(container => {
        const visibleCards = container.querySelectorAll(".cardmonitoria:not(.tab-hidden)");
        container.style.display = visibleCards.length > 0 ? "" : "none";
    });
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add public/scripts/monitorias/carregarMonitorias.js
  git commit -m "fix(filtro): hide empty curso containers after campus filter"
  ```

---

### Task 7: Testar busca por nome ainda funciona

- [ ] **Step 1: Verificar que a busca por nome ainda funciona**

  The search function uses `document.querySelectorAll(".cardmonitoria")` and checks `nomeMonitoria.includes(termo)`. It sets `card.style.display`. This should still work for individual cards, but may leave empty curso containers visible.

  Update the search handler to also hide empty curso containers:

  ```javascript
  const buscarMonitoria = document.getElementById("buscaMonitoria");
  const filtrar = () => {
      const termo = buscarMonitoria.value.toLowerCase();
      document.querySelectorAll(".cardmonitoria").forEach(card => {
          const nomeMonitoria = card.querySelector(".nomemonitoria").textContent.toLowerCase();
          card.style.display = nomeMonitoria.includes(termo) ? "" : "none";
      });

      // Hide empty curso containers
      document.querySelectorAll(".curso-container").forEach(container => {
          const visibleCards = container.querySelectorAll('.cardmonitoria[style=""]');
          container.style.display = visibleCards.length > 0 ? "" : "none";
      });
  };
  ```

  **Note:** The selector `'.cardmonitoria[style=""]'` is brittle. A better approach is to check `card.style.display !== "none"`:

  ```javascript
  document.querySelectorAll(".curso-container").forEach(container => {
      const hasVisible = Array.from(container.querySelectorAll(".cardmonitoria"))
          .some(card => card.style.display !== "none" && !card.classList.contains("tab-hidden"));
      container.style.display = hasVisible ? "" : "none";
  });
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add public/scripts/monitorias/carregarMonitorias.js
  git commit -m "fix(busca): hide empty curso containers after search"
  ```

---

## Self-Review Checklist

### Spec coverage
- [x] Agrupamento dinamico por curso — Task 5
- [x] Cards vazios omitidos — Task 5 (naturalmente, so cria container se houver monitorias)
- [x] Card interno inalterado — Task 5 (codigo do card copiado literalmente)
- [x] Estado vazio — ja existente, nao alterado
- [x] Filtro de campus — Task 6
- [x] Cor unica para todos os cursos — Task 4 (`.curso-sigla` usa gradiente azul fixo)

### Placeholder scan
- [x] Nenhum TBD/TODO encontrado
- [x] Nenhum "implement later"
- [x] Todos os passos tem codigo completo

### Type consistency
- [x] `cursoId` é Int no schema e no Prisma client
- [x] `disciplina.curso` é incluido no repository e acessado como `m.disciplina.curso.nome` no JS
