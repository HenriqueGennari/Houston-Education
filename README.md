# 🚀 Houston Education – Sistema de Monitoria Estudantil

> **"Terra Chamando Houston!"** > Transformando a dificuldade acadêmica em colaboração mútua através de uma plataforma inteligente de monitoria.

Este projeto foi desenvolvido para o **Projeto Integrador** do curso de **Análise e Desenvolvimento de Sistemas (UniCEUB)**, focado em otimizar a ligação entre alunos com dificuldades e monitores capacitados.

---

## 💡 O Problema e a Nossa Solução

Identificamos que muitos estudantes enfrentam barreiras no aprendizado por falta de suporte imediato, enquanto alunos com alto desempenho não possuem um canal organizado para compartilhar conhecimento. 

A **Houston Education** surge para centralizar este ecossistema:
- **Para o Aluno:** Encontra auxílio rápido em disciplinas críticas e melhora o seu rendimento.
- **Para o Monitor:** Gere os seus horários, turmas e consolida o seu conhecimento ensinando.
- **Para a Instituição:** Reduz a taxa de retenção e promove o engajamento estudantil.

---

## 🛠️ Stack Tecnológica

O projeto utiliza uma arquitetura moderna e robusta, garantindo performance e segurança:

* **Backend:** [Node.js](https://nodejs.org/) com [TypeScript](https://www.typescriptlang.org/) (Tipagem forte para evitar erros em tempo de execução).
* **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) gerenciado pelo [Prisma ORM](https://www.prisma.io/).
* **Segurança:** Autenticação via **JWT** (JSON Web Token) e criptografia de passwords com **Bcrypt**.
* **Frontend:** HTML5, CSS3 e JavaScript (Design focado na experiência do usuário - UX).
* **Arquitetura:** Padrão **MVC** (Model-View-Controller) para uma organização de código limpa e modular.
## 🚀 Tecnologias Utilizadas

O projeto foi construído com base em uma stack moderna e escalável, empregando os seguintes recursos:

- **TypeScript** e **Node.js** – Desenvolvimento do backend com tipagem estática e alta confiabilidade.  
- **Prisma ORM** – Gerenciamento e modelagem de dados.  
- **PostgreSQL** – Banco de dados escolhido.
- **Arquitetura MVC** – Organização e separação clara de responsabilidades.  
- **HTML, CSS e JavaScript** – Construção do frontend com design responsivo.  

---

## 📋 Funcionalidades Principais

| Recurso | Descrição |
| :--- | :--- |
| **Autenticação Segura** | Login diferenciado para Alunos e Monitores. |
| **Dashboard de Monitorias** | Visualização de disciplinas, datas e horários disponíveis. |
| **Inscrição Simplicada** | Fluxo rápido para o aluno garantir a sua vaga na sessão de ensino. |
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
    ```
5.  **Inicie o servidor:**
    ```bash
    npm run dev
    ```
6.  **Acesse o Frontend:**
    Abra o arquivo `pages/login.html` utilizando a extensão **Live Server** do VS Code.

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
