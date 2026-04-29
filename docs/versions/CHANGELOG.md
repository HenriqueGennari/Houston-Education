# Changelog

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
![Tela de Login](../img/TELAS-V1.0.0/loginV1.png)
![Tela de Cadastro](../img/TELAS-V1.0.0/cadastroV1.png)

#### Home & Dashboard
![Tela Home](../img/TELAS-V1.0.0/homeV1.png)
![Tela Dashboard Admin](../img/TELAS-V1.0.0/dashboardAdminV1.png)

#### Monitorias
![Tela de Gerenciamento](../img/TELAS-V1.0.0/gerenciamentoMonitoriasV1.png)
![Tela de Cadastro de Monitorias](../img/TELAS-V1.0.0/cadastroMonitoriasV1.png)

</details>


---

