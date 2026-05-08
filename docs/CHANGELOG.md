# Changelog Houston Education
### Ferrari´s a 200 por hora.

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).




## Legenda

| Tag | Descrição |
|-----|-----------|
| `Added` | Novas funcionalidades adicionadas ao sistema |
| `Changed` | Alterações em funcionalidades existentes |
| `Deprecated` | Funcionalidades que serão removidas em versões futuras |
| `Removed` | Funcionalidades removidas nesta versão |
| `Fixed` | Correções de bugs e erros |
| `Security` | Correções e melhorias relacionadas à segurança |

---

## Como Versionar

Este projeto utiliza o padrão **SemVer** (Semantic Versioning):

- **MAJOR** (`X.0.0`): alterações incompatíveis com versões anteriores
- **MINOR** (`0.X.0`): adição de funcionalidades mantendo compatibilidade
- **PATCH** (`0.0.X`): correções de bugs e ajustes menores

Exemplo de evolução de versão:

```
0.1.0 -> 0.2.0 -> 0.3.0 -> 1.0.0 -> 1.1.0 -> 1.1.1
```

---

## Notes

- **Versões mais antigas ficam sempre abaixo das versões mais recentes, seguindo o padrão estabelecido.**

---

## [1.2.0] - 2026-05-08

### Added

**Aba Perfil**
- Criada página de Perfil (`perfil.html`) para atualização de dados pessoais (nome, email, matrícula).
- Adicionado item "Perfil" no menu lateral visível para todos os perfis (Aluno, Monitor e Admin).

**Botão de Detalhes na Aba de Gerenciamento**
- Adicionado botão "Detalhes" nos cards de monitoria na tela de gerenciamento.
- Exibe popup com lista de todos os alunos inscritos naquela monitoria.
- Criado endpoint separado para trazer as informações de inscritos.

**Validações e Regras de Negócio**
- Adicionado tratamento de erro para matrícula duplicada: query que verifica se a matrícula já existe no banco antes de cadastrar/atualizar. Ademais, foi adicionado a validação para horário de fim menor ou igual ao horário de início.
- Adicionada validação de campos vazios no update de aluno: nome e email não podem ser enviados como string vazia, permitindo que apenas um campo seja atualizado por vez.

**Repository de Aluno**
- Criada função `findByEmailAndMatricula` que busca por email OU matrícula em uma única query.
- Substituídos todos os usos de `findByEmail` e `findByMatricula` isolados pela nova função unificada.

### Changed

**Modal de Atualização de Monitorias**
- Remodelação da modal de atualização com layout mais compacto.
- Campo "Descrição" movido para linha própria abaixo de "Nome" e acima de "Data", utilizando `textarea` para textos longos.
- Dropdowns de local e disciplina agora são filtrados com base no campus e curso selecionados previamente.



**JWT**
- Token JWT agora inclui o campo `matricula` no payload, eliminando a necessidade de endpoint extra para buscar dados do usuário logado.

### Fixed

**Responsividade do Dashboard Admin**
- Adicionado scroll horizontal nas tabelas do dashboard para dispositivos móveis (telas < 768px).
- Reduzido tamanho dos botões de ação (editar/excluir) em mobile para melhor usabilidade.

**Layout e Popups**
- Corrigido vazamento de texto da descrição nos cards e popups de monitoria com quebra de linha (`word-wrap: break-word`).
- Corrigido caminho de redirecionamento da aba Perfil para a Home.

<details>
<summary>🖼️ <b>Clique aqui para visualizar as telas desta versão</b></summary>

<br>

#### Home
![Tela Home](./img/TELAS-V1.1.0/homeV1.1.png)

#### Dashboard Admin
![Dashboard Admin - Usuários](./img/TELAS-V1.1.0/dashboardAdminUsuariosV1.1.png)
![Dashboard Admin - Locais](./img/TELAS-V1.1.0/dashboardAdminLocaisV1.1.png)
![Dashboard Admin - Disciplinas](./img/TELAS-V1.1.0/dashboardAdminDisciplinasV1.1.png)
![Dashboard Admin - Cursos](./img/TELAS-V1.1.0/dashboardAdminCursosV1.1.png)

#### Monitorias
![Tela de Gerenciamento](./img/TELAS-V1.2.0/gerenciamentoMonitoriasV1.2.png)
![Tela de Cadastro de Monitorias](./img/TELAS-V1.1.0/cadastroMonitoriasV1.1.png)

#### Perfil

![Tela de perfil](./img/TELAS-V1.2.0/perfilV1.2.png)

</details>


---


## [1.1.0] - 2026-04-30

### Added

**Entidade Curso**
- Criação da entidade `Curso` no schema do Prisma
- Tabela de junção `DisciplinaCurso` para relacionamento N:N entre Disciplina e Curso.
- CRUD completo da entidade Curso (Controller, Service, Repository).
- Páginas de dashboard para gerenciamento de disciplinas, locais e cursos no painel administrativo.
- Script `carregarCursos.js` para integração do frontend com a API de cursos.

**Associação Disciplina ↔ Curso**
- Associação de disciplinas com nenhum, um ou mais cursos nas operações de criação, atualização e consulta.
- Campos de curso incluídos nos dados retornados nas APIs de monitoria.

**Validação e Regras de Negócio**
- Adicionada unicidade (`@unique`) nos campos `nome` das entidades `Curso` e `Disciplina`.

**Infraestrutura**
- Nova migration `add_disciplina_curso` para criação das tabelas de Curso e DisciplinaCurso.
- Nova migration `add_unique_nome_curso_disciplina` para garantir unicidade nos nomes.
- Atualização do seed do banco de dados para refletir as novas entidades.

### Changed

**Layout da Home**
- Redesign do layout da página home com agrupamento de monitorias por curso em cards organizados.
- Cada card de monitoria agora exibe a sigla do curso associado.

**Dashboard Admin**
- Criação de páginas e scripts dedicados para gerenciamento de Locais, Disciplinas e Cursos no dashboard administrativo.
- Melhorias no CSS do painel administrativo (`estiloDashboardAdmin.css`).

### Fixed

**Fuso Horário das Monitorias**
- Corrigido o problema de deslocamento de 3 horas no cadastro e exibição das monitorias causado pela interpretação UTC em produção.
- Implementadas funções `criarDateBRT()` e `extrairHoraBRT()` no `MonitoriaService` para garantir que os horários sejam sempre tratados no padrão de Brasília (BRT, UTC-3).

**Layout da Tela de Gerenciamento**
- Ajustado o grid da página "Gerenciar Monitorias" para exibir 4 cards por linha em telas grandes.
- Removido o `max-width` dos cards para aproveitamento melhor do espaço disponível.

### Security
- Adicionada validação `noUnknown` nos schemas Yup para rejeitar campos não permitidos nas requisições.

<details>
<summary>🖼️ <b>Clique aqui para visualizar as telas desta versão</b></summary>

<br>

#### Home
![Tela Home](./img/TELAS-V1.1.0/homeV1.1.png)

#### Dashboard Admin
![Dashboard Admin - Usuários](./img/TELAS-V1.1.0/dashboardAdminUsuariosV1.1.png)
![Dashboard Admin - Locais](./img/TELAS-V1.1.0/dashboardAdminLocaisV1.1.png)
![Dashboard Admin - Disciplinas](./img/TELAS-V1.1.0/dashboardAdminDisciplinasV1.1.png)
![Dashboard Admin - Cursos](./img/TELAS-V1.1.0/dashboardAdminCursosV1.1.png)

#### Monitorias
![Tela de Gerenciamento](./img/TELAS-V1.1.0/gerenciamentoMonitoriasV1.1.png)
![Tela de Cadastro de Monitorias](./img/TELAS-V1.1.0/cadastroMonitoriasV1.1.png)

</details>

---


## [1.0.0] - 2026-04-28 - Primeira Versão oficial 


### Added
**Funcionalidades (Features)**
- CRUD completo e regras de negócio para as entidades: Aluno, Disciplina, Monitoria, Inscrições e Local.
- Páginas de interface de usuário (UI): Login, Home, Cadastro, Gerenciamento de Monitorias e Dashboard Admin.
- Sistema de autenticação de usuários integrado com JWT.

**Infraestrutura e Arquitetura**
- Estrutura inicial do projeto em Node.js com TypeScript.
- Configuração do servidor com Express.
- Integração com banco de dados PostgreSQL utilizando Prisma ORM.
- Criação de middlewares de segurança para autenticação, autorização e validação de requisições.
- Validação de schemas e rotas utilizando a biblioteca Yup.
- Separação da arquitetura em padrão MVC (Controller -> Service -> Repository).
- Implementação de Repositórios InMemory para a execução de testes isolados.
- Configuração de CI/CD via GitHub Actions para build automatizado.
- Estratégia de branches definida: `main` (produção) e `dev` (desenvolvimento contínuo).
- Deploy e hospedagem da aplicação configurados no Render.

<details>
<summary>🖼️ <b>Clique aqui para visualizar as telas desta versão</b></summary>

<br>

#### Login & Cadastro
![Tela de Login](./img/TELAS-V1.0.0/loginV1.png)
![Tela de Cadastro](./img/TELAS-V1.0.0/cadastroV1.png)

#### Home & Dashboard
![Tela Home](./img/TELAS-V1.0.0/homeV1.png)
![Tela Dashboard Admin](./img/TELAS-V1.0.0/dashboardAdminV1.png)

#### Monitorias
![Tela de Gerenciamento](./img/TELAS-V1.0.0/gerenciamentoMonitoriasV1.png)
![Tela de Cadastro de Monitorias](./img/TELAS-V1.0.0/cadastroMonitoriasV1.png)

</details>


---

