# 🚀 Houston Education – Sistema de Monitoria Estudantil

> **"Terra Chamando Houston!"** > Transformando a dificuldade acadêmica em colaboração mútua através de uma plataforma inteligente de monitoria.

Este projeto foi desenvolvido para o **Projeto Integrador** do curso de **Análise e Desenvolvimento de Sistemas (UniCEUB)**, focado em otimizar a ligação entre alunos com dificuldades e monitores capacitados.

---

## 💡 O Problema e a Nossa Solução

Identificamos que muitos estudantes enfrentam barreiras no aprendizado por falta de suporte imediato, enquanto alunos com alto desempenho não possuem um canal organizado para compartilhar conhecimento. 

A **Houston Education** surge para centralizar este ecossistema:
- **Para o Aluno:** Encontra auxílio rápido em disciplinas críticas e melhora o seu rendimento.
- **Para o Monitor:** Gere os seus horários e consolida o seu conhecimento da melhor forma: ensinando.
- **Para a Instituição:** Reduz a taxa de retenção e promove o engajamento estudantil.


---

## 📚 Documentação do Sistema

Para informações detalhadas sobre a arquitetura, regras de negócio e o histórico de evolução do projeto, acesse a pasta `/docs`:

- **[Documentação Principal](./docs/MainDoc.md):** Contém o detalhamento completo do sistema, diagramas e especificações técnicas.
- **[Changelog (Versionamento)](./docs/CHANGELOG.md):** Registro cronológico de todas as atualizações e versões, além de correções e novas funcionalidades implementadas.

---

## 🛠️ Stack Tecnológica

* **Backend:** [Node.js](https://nodejs.org/) com [TypeScript](https://www.typescriptlang.org/)
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) usando o [Prisma ORM](https://www.prisma.io/)
* **Frontend:** HTML5, CSS3 e JavaScript.
* **Arquitetura:** Padrão **MVC** (Model-View-Controller)

## 📋 Funcionalidades Principais

| Recurso | Descrição |
| :--- | :--- |
| **Autenticação Segura** | Login diferenciado para Alunos e Monitores. |
| **Dashboard de Monitorias** | Visualização de disciplinas, datas e horários disponíveis. |
| **Inscrição Simplicada** | Fluxo rápido para o aluno garantir a sua vaga. |
| **Gestão de Perfil** | Controle de informações pessoais e histórico de participações. |
| **Painel do Monitor** | Área exclusiva para criação, edição e gestão de monitorias. |

---

## ⚙️ Como Executar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/HenriqueGennari/ProjetoIntegeradorMonitoria.git
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure o Banco de Dados:**
    Certifique-se de que o seu PostgreSQL está ativo e configure a `DATABASE_URL` no arquivo `prisma.config.ts` ou `.env`.
4.  **Rode as migrações e o Seed (Dados Iniciais):**
    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```
5.  **Inicie o servidor:**
    ```bash
    npm run dev
    ```
---

## 👨‍💻 Devs

**Henrique Gennari**  
💼 https://www.linkedin.com/in/henriquegennari
📧 henriquegennarilemgruber@gmail.com

**Pedro Henrique**  
💼 https://www.linkedin.com/in/pedro-hcruzz
📧 pedro.hcruzz14@gmail.com

---

### 📄 Licença
Este projeto é de uso acadêmico e pessoal, sem fins comerciais.

### 🚀 Houston, Ferraris a 200 por Hora!
Este projeto é a prova de que a tecnologia, quando bem aplicada, pode democratizar o ensino e facilitar a jornada acadêmica de todos.
