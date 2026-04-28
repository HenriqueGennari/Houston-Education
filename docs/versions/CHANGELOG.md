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

## [1.0.0] - 2026-04-28

### Added

- Estrutura inicial do projeto em Node.js com TypeScript
- Configuração do servidor Express com suporte a EJS como template engine
- Integração com Prisma ORM para gerenciamento do banco de dados
- Sistema de autenticação com JWT e middleware de autorização por perfil
- CRUD completo para as entidades: Aluno, Disciplina, Monitoria, Inscrições, Campus e Local
- Validação de schemas com Yup para todas as rotas de entrada
- Páginas de login, home e logout renderizadas via EJS
- Repositórios Prisma para persistência de dados
- Repositórios InMemory para testes isolados
- CI/CD com GitHub Actions para build automatizado
- Geração de diagrama ERD do banco via Prisma ERD Generator
- Seed de popularização das tabelas
- Middleware de validação de schemas reutilizável

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
