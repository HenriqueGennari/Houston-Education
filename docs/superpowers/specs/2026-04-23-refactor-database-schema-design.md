# Refactor do Schema do Banco de Dados

## Resumo

Refatoração do schema Prisma/PostgreSQL para:
1. Substituir o enum `Perfil` por uma tabela `Perfil`.
2. Eliminar a tabela `Monitor`, movendo seu relacionamento para `Aluno`.
3. Simplificar os campos de data/hora de `Monitoria` de 3 campos (`data`, `hora_inicio`, `hora_fim`) para 2 campos (`inicio`, `fim`).
4. Remover o prefixo `tb_` de todas as tabelas.

---

## Schema Prisma Final

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Perfil {
  id        String  @id @default(dbgenerated("gen_random_uuid()"))
  nome      String  @unique
  descricao String?

  alunos Aluno[]

  @@map("perfil")
}

model Aluno {
  id        String   @id @default(dbgenerated("gen_random_uuid()"))
  nome      String
  email     String   @unique
  senha     String
  matricula String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  perfilId String
  perfil   Perfil @relation(fields: [perfilId], references: [id])

  monitorias Monitoria[]
  inscricoes Inscricao[]

  @@map("aluno")
}

model Disciplina {
  id         String      @id @default(uuid())
  nome       String
  descricao  String?
  monitorias Monitoria[]

  @@map("disciplina")
}

model Monitoria {
  id             String   @id @default(dbgenerated("gen_random_uuid()"))
  nome_monitoria String
  inicio         DateTime
  fim            DateTime
  local          String?

  monitorId String
  monitor   Aluno @relation(fields: [monitorId], references: [id])

  disciplinaId String
  disciplina   Disciplina @relation(fields: [disciplinaId], references: [id])

  inscricoes Inscricao[]

  @@map("monitoria")
}

model Inscricao {
  id          String   @id @default(dbgenerated("gen_random_uuid()"))
  alunoId     String
  monitoriaId String
  criadoEm    DateTime @default(now())

  aluno     Aluno     @relation(fields: [alunoId], references: [id])
  monitoria Monitoria @relation(fields: [monitoriaId], references: [id])

  @@unique([alunoId, monitoriaId])

  @@map("inscricao")
}
```

---

## Script SQL de Migração (PostgreSQL)

> **Atenção:** Execute em ambiente de staging antes de produção. Faça backup dos dados antes de executar.

```sql
-- ============================================================
-- 1. CRIAR TABELA PERFIL
-- ============================================================
CREATE TABLE perfil (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT
);

-- Inserir perfis existentes (mapeamento do enum)
INSERT INTO perfil (id, nome, descricao) VALUES
    (gen_random_uuid(), 'ALUNO', 'Usuário comum'),
    (gen_random_uuid(), 'MONITOR', 'Usuário que ministra monitorias'),
    (gen_random_uuid(), 'ADMIN', 'Administrador do sistema');

-- ============================================================
-- 2. ALTERAR TB_ALUNO: SUBSTITUIR ENUM PERFIL POR FK
-- ============================================================
-- Adicionar coluna de FK
ALTER TABLE tb_aluno ADD COLUMN perfil_id UUID;

-- Atualizar alunos com base no enum atual
UPDATE tb_aluno
SET perfil_id = p.id
FROM perfil p
WHERE tb_aluno.perfil::text = p.nome;

-- Tornar NOT NULL após popular
ALTER TABLE tb_aluno ALTER COLUMN perfil_id SET NOT NULL;

-- Adicionar constraint FK
ALTER TABLE tb_aluno
ADD CONSTRAINT fk_aluno_perfil
FOREIGN KEY (perfil_id) REFERENCES perfil(id);

-- Remover coluna enum antiga
ALTER TABLE tb_aluno DROP COLUMN perfil;

-- ============================================================
-- 3. ELIMINAR TABELA TB_MONITOR E ATUALIZAR FK DE TB_MONITORIA
-- ============================================================
-- A tabela tb_monitoria referencia tb_monitor.monitorId.
-- Como monitor agora é um Aluno, a FK deve apontar para tb_aluno.id.
-- Como monitorId em tb_monitor era o mesmo id do aluno, os dados já são compatíveis.

-- Remover FK antiga de tb_monitoria -> tb_monitor
ALTER TABLE tb_monitoria DROP CONSTRAINT tb_monitoria_monitorId_fkey;

-- Dropar tabela tb_monitor
DROP TABLE tb_monitor;

-- Adicionar nova FK de tb_monitoria -> tb_aluno
ALTER TABLE tb_monitoria
ADD CONSTRAINT fk_monitoria_monitor_aluno
FOREIGN KEY (monitorId) REFERENCES tb_aluno(id);

-- ============================================================
-- 4. SIMPLIFICAR CAMPOS DE DATA/HORA EM TB_MONITORIA
-- ============================================================
-- Adicionar novas colunas
ALTER TABLE tb_monitoria ADD COLUMN inicio TIMESTAMP WITH TIME ZONE;
ALTER TABLE tb_monitoria ADD COLUMN fim TIMESTAMP WITH TIME ZONE;

-- Migrar dados: combinar data + hora_inicio/hora_fim
UPDATE tb_monitoria
SET
    inicio = (data::date + hora_inicio::time) AT TIME ZONE 'UTC',
    fim    = (data::date + hora_fim::time) AT TIME ZONE 'UTC';

-- Tornar NOT NULL
ALTER TABLE tb_monitoria ALTER COLUMN inicio SET NOT NULL;
ALTER TABLE tb_monitoria ALTER COLUMN fim SET NOT NULL;

-- Remover colunas antigas
ALTER TABLE tb_monitoria DROP COLUMN data;
ALTER TABLE tb_monitoria DROP COLUMN hora_inicio;
ALTER TABLE tb_monitoria DROP COLUMN hora_fim;

-- ============================================================
-- 5. RENOMEAR TABELAS (REMOVER PREFIXO TB_)
-- ============================================================
ALTER TABLE tb_aluno RENAME TO aluno;
ALTER TABLE tb_disciplina RENAME TO disciplina;
ALTER TABLE tb_monitoria RENAME TO monitoria;
ALTER TABLE tb_inscricoes RENAME TO inscricao;

-- ============================================================
-- 6. ATUALIZAR CONSTRAINTS E SEQUENCES (SE HOUVER)
-- ============================================================
-- Renomear constraints de PK/FK automaticamente renomeadas ou manuais se necessário
-- PostgreSQL renomeia constraints automaticamente ao renomear tabelas,
-- mas indexes e constraints com nomes explícitos podem precisar de ajuste.

-- Renomear constraints de unique em inscricao
ALTER TABLE inscricao RENAME CONSTRAINT tb_inscricoes_alunoId_monitoriaId_key TO inscricao_alunoId_monitoriaId_key;
```

---

## Impacto no Código Existente

Os seguintes arquivos precisarão de ajustes após a migração:

| Arquivo | Motivo da Mudança |
|---------|-------------------|
| `prisma/schema.prisma` | Schema completo atualizado |
| `src/schemas/monitoriaSchema.ts` | Campos `data`, `hora_inicio`, `hora_fim` -> `inicio`, `fim` (formato ISO 8601 DateTime) |
| `src/schemas/alunoSchema.ts` | `perfil` (string do enum) -> `perfilId` (UUID string) |
| `src/services/Monitor/MonitorService.ts` | Lógica de criação de monitor usa `tb_monitor`; precisa usar `Aluno` com `perfilId` do perfil MONITOR |
| `src/repositories/Prisma/MonitorPrismaRepository.ts` | Queries em `prisma.monitor` precisam ser removidas ou adaptadas |
| `src/repositories/Prisma/AlunoPrismaRepository.ts` | Possivelmente adicionar lógica de atualização de `perfilId` |
| `src/repositories/Prisma/MonitoriaPrismaRepository.ts` | Relação `monitor` agora aponta para `Aluno` em vez de `Monitor` |
| `src/controllers/Monitor/MonitorController.ts` | Endpoints podem precisar de ajuste se dependerem do tipo `Monitor` |
| `src/middlewares/authorizationMiddleware.ts` | Verificação de `Perfil.MONITOR` via enum -> verificação via tabela `Perfil` |
| `src/services/Auth/AuthService.ts` | Retorno de `perfil` no login/token pode precisar de include da tabela Perfil |

---

## Decisões de Design

### Por que manter `Aluno` como nome em vez de renomear para `Usuario`?
O escopo atual da aplicação é um sistema de monitoria acadêmica. Todos os usuários são alunos, mesmo que com perfis diferentes. Renomear para `Usuario` seria semanticamente correto em um sistema genérico, mas `Aluno` reflete melhor o domínio atual. Se no futuro professores/coordenadores sem matrícula forem adicionados, aí sim uma renomeação para `Usuario` faria sentido.

### Por que `Perfil` como tabela e não enum?
Flexibilidade para adicionar novos perfis via interface administrativa sem deploy de código. Permite também adicionar metadados (descrição, permissões) no futuro.

### Por que `inicio`/`fim` como DateTime e não separar data/hora?
Um timestamp único é mais simples, evita inconsistências (ex: `hora_inicio` sem `data`) e facilita queries por intervalo (`WHERE inicio BETWEEN x AND y`). O frontend pode extrair a data e hora para exibição quando necessário.

---

## Próximos Passos

1. Aprovar este spec.
2. Gerar migration via Prisma (`npx prisma migrate dev` após atualizar o schema) **OU** executar o script SQL manualmente em produção.
3. Atualizar código-fonte conforme tabela de impacto.
4. Rodar testes e validar funcionalidades.
