# Design: Visualizacao de Monitorias Agrupadas por Curso

## Contexto

A home do sistema (`home.html`) exibe monitorias disponiveis em uma lista plana. Cada monitoria e um card com nome, disciplina, data/hora, campus e botao de inscricao. O usuario quer manter essa visualizacao existente, mas agrupar os cards de monitoria dentro de containers por **Curso**.

Relacao: **Curso -> Disciplina -> Monitoria**. A monitoria ja possui `disciplina`, que tera um `curso`.

## Objetivo

Agrupar visualmente as monitorias por curso na pagina inicial, mantendo o card interno de cada monitoria inalterado. Apenas o container externo (a "caixa") e modificado.

## Design

### Estrutura Visual

```
[Tabs de Campus: Todas | Asa Norte | Taguatinga]

[Card de Curso: Ciencia da Computacao]
  +--------------------------------------------------+
  |  [CC]  Ciencia da Computacao                     |
  +--------------------------------------------------+
  |  [Card Monitoria BD]  [Card Monitoria LP]        |
  +--------------------------------------------------+

[Card de Curso: Arquitetura]
  +--------------------------------------------------+
  |  [AR]  Arquitetura                               |
  +--------------------------------------------------+
  |  [Card Monitoria Desenho]                        |
  +--------------------------------------------------+

[Direito nao aparece - sem monitorias]
```

### Comportamento

1. **Agrupamento dinamico**: O JS agrupa as monitorias recebidas da API por `disciplina.curso.nome`. Cada curso unico gera um card-container.
2. **Cards vazios omitidos**: Cursos sem monitorias no campus selecionado nao renderizam card algum.
3. **Card interno inalterado**: O HTML e comportamento de cada card de monitoria (click, popup, botao inscrever, etc.) permanecem identicos ao atual.
4. **Estado vazio**: Se nenhuma monitoria existir no campus filtrado, exibe "Nenhuma monitoria encontrada!" (mensagem ja existente).
5. **Filtro de campus**: As tabs de campus (`Todas`, `Asa Norte`, `Taguatinga`) continuam funcionando. O filtro e aplicado ANTES do agrupamento por curso.

### Fluxo de Dados

```
API /monitorias/disponiveis
  |
  v
[Filtrar por campus se tab != "todas"]
  |
  v
[Agrupar por disciplina.curso.nome]
  |
  v
[Para cada curso: criar card-container]
  |
  v
[Para cada monitoria do curso: renderizar card interno]
```

### Dados Necessarios

A API `/monitorias/disponiveis` precisa retornar, para cada monitoria:
- `disciplina` com `nome`
- `disciplina.curso` com `nome` (e possivelmente `id`, `cor`)

### Estilo do Container de Curso

- Borda arredondada (`border-radius: 12px`)
- Borda na cor do tema (`#024059`)
- Header com sigla do curso em badge colorido + nome do curso
- Padding interno
- Cards de monitoria dentro dispostos em flex/grid

### Cores dos Cursos

Inicialmente, cores fixas por curso (baseadas no nome):
- Ciencia da Computacao: gradiente azul (#024059)
- Arquitetura: gradiente marrom (#6b4c35)
- Direito: gradiente bordô (#722f37)
- Outros: gerado a partir de hash do nome

## Arquivos Afetados

- `public/scripts/monitorias/carregarMonitorias.js` - logica de agrupamento e renderizacao
- `public/style/style.css` - estilos do container de curso (novos)
- `src/routes/Monitoria/monitoriaRoutes.ts` ou controller - incluir `curso` no retorno da API

## Fora do Escopo (Desta Iteracao)

- Criar entidade Curso no schema (ja existe no planejamento)
- Criar APIs de CRUD para Curso
- Dashboard Admin para cursos
- Alterar o card interno da monitoria
