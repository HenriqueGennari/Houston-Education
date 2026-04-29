# Changelog

Todas as alterações notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.0.0] - 2026-01-15 (Proxima versao aqui)

### Added
    
- Teste

### Changed

- Teste

### Deprecated

- Teste
### Removed

- Teste

### Fixed

- Teste

### Security

- Teste

---

## [1.0.0] - 2026-04-28 - Primeira Versão oficial 

### Added / Structure

- Estrutura inicial do projeto em Node.js com TypeScript
- Configuração do servidor Express
- Uso do Prisma como ORM para gerenciamento do banco de dados em conjunto com o banco criado no PostgresSQL.
- Criação do schema do Prisma refletindo todas as tabelas e tabelas de relacionamento do banco de dados 
- Criação de middlewares de segurança para autenticação e autorização e para validação do próprio YUP
- Sistema de autenticação com uso do JWT
- Validação de schemas com Yup para todas as rotas da aplicação
- Páginas de login, home e logout, gerenciamento, cadastro de monitorias e dashboard
- CRUD completo para as entidades: Aluno, Disciplina, Monitoria, Inscrições, e Local e suas regras de negócio definidas 
- Separção MVC do código: Controller -> Service -> Repository
- Repositórios InMemory para testes isolados
- CI/CD com GitHub Actions para build automatizado
- Branchs main e dev - Main para produção, Dev para desenvolvimento de novas versões
- Aplicação hospedada no Render

--- 

### SCREENS

#### LOGIN
![Tela de Login](../img/TELAS-V1.0.0/loginV1.png)
#### Cadastro
![Tela de Cadastro](../img/TELAS-V1.0.0/cadastroV1.png)
#### Home
![Tela Home](../img/TELAS-V1.0.0/homeV1.png)
#### Gerenciamento de Monitorias
![Tela de Gerenciamento](../img/TELAS-V1.0.0/gerenciamentoMonitoriasV1.png)
#### Dashboard Admin
![Tela Dashboard Admin](../img/TELAS-V1.0.0/dashboardAdminV1.png)
#### Cadastro de monitorias
![Tela de Cadastro de Monitorias](../img/TELAS-V1.0.0/cadastroMonitoriasV1.png)

---



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
