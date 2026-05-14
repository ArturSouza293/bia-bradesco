# Bia · Bradesco — Demo offline

App **local e offline** que testa a **Bia**, um agente de IA que guia o cliente
por uma jornada com **começo, meio e fim**: descobrir e estruturar seus
**objetivos de vida**, receber **educação financeira básica** pelo caminho, e
ser encaminhado para a próxima etapa — o **planejamento financeiro** (fluxo de
caixa futuro), que é a fronteira final deste caso de uso.

A Bia também tem uma **lente de gerente de conta**: enquanto conversa, ela
detecta (em silêncio) oportunidades comerciais para o banco revisar depois.

> ⚠️ Demonstração técnica. Não é o atendimento oficial do Bradesco.

---

## 🎯 A jornada (3 fases)

```
[1] Landing  →  [2] Workspace: conversa + app "Meus Objetivos"

  Fase 1 — Boas-vindas    apresenta a jornada, pega o aceite
  Fase 2 — Descoberta     estrutura objetivos (SMART) + educação financeira
                          + detecta cross-sell (silencioso)
  Fase 3 — Fechamento     recapitula objetivos + conceitos aprendidos,
                          encaminha para o PLANEJAMENTO FINANCEIRO
```

| Fronteira | Definição |
|---|---|
| **Entrada** | Landing com "Conversar com a Bia". Sem login. |
| **Escopo** | Descoberta de objetivos (SMART) + educação financeira básica. |
| **Cross-sell** | A Bia anota oportunidades comerciais — **sem oferecer ao cliente**. Lista interna para o gerente. |
| **Fora de escopo** | Fluxo de caixa, alocação, produtos, suitability — anotados para a próxima etapa. |
| **Saída** | 3–5 objetivos estruturados + conceitos ensinados + oportunidades comerciais. |

---

## 🧱 Arquitetura — tudo local

```
┌──────────────────────────┐   /api/*   ┌──────────────────────┐
│  Frontend (React + Vite) │ ─────────▶ │  Servidor Express     │
│  Dois iPhones lado a lado │  (proxy)   │  (Node, porta 3001)   │
│   • conversa WhatsApp     │ ◀───────── │   ├─ motor real/mock  │
│   • app "Meus Objetivos"  │    SSE     │   └─ SQLite (node:sqlite)
└──────────────────────────┘            └──────────────────────┘
                                    internet só p/ o motor Claude real
```

- **Frontend**: React 18 + TypeScript + Vite + Tailwind + Zustand.
  - **Desktop (≥ 1280px)**: dois iPhones 17 Pro Max lado a lado — a conversa
    estilo WhatsApp à esquerda, o app "Meus Objetivos" à direita, preenchendo
    ao vivo conforme a Bia registra objetivos.
  - **Abaixo disso**: um iPhone, alternando entre conversa e app por um toggle.
- **Backend**: servidor Express local. **SQLite via `node:sqlite`** (embutido no
  Node 22.5+, **zero dependências nativas** — roda offline sem build tools).
- **Dois motores de conversa**:
  - **mock** — conversa scriptada de 7 passos, **100% offline**, sem custo.
  - **claude** — motor real (`claude-opus-4-7`) com streaming SSE + tool use.
  - Escolha automática: sem `ANTHROPIC_API_KEY` válida (ou `MOCK_LLM=true`)
    → mock. Com a key → Claude real.

Não há nada na nuvem. É um projeto Git com banco que roda na sua máquina.

---

## 🚀 Como rodar

### Pré-requisito
- **Node.js 22.5+** (testado no 24). Nada mais — sem Postgres, sem Docker.

### Instalar e configurar
```powershell
npm install
Copy-Item .env.example .env
# Edite .env:
#  - ANTHROPIC_API_KEY vazia (ou MOCK_LLM=true) → roda 100% offline (mock)
#  - ANTHROPIC_API_KEY preenchida               → usa o Claude real
```

### Desenvolvimento (hot reload)
```powershell
npm run dev          # Vite (5173) + servidor (3001). Abra http://localhost:5173
```

### App offline (processo único)
```powershell
npm run build
npm start            # serve frontend + API em http://localhost:3001
```

---

## ⚙️ Configuração (`.env`)

| Variável | Para quê |
|---|---|
| `ANTHROPIC_API_KEY` | Key do Claude. **Vazia = modo mock (offline).** |
| `ANTHROPIC_MODEL` | Modelo (padrão `claude-opus-4-7`). |
| `PORT` | Porta do servidor (padrão `3001`). |
| `MOCK_LLM` | `true` força o motor mock mesmo com a key presente. |

O `.env` é lido pelo próprio servidor (com override).

---

## 📁 Estrutura

```
bia-bradesco/
├── server/                     ← backend local (Node + Express)
│   ├── index.ts                ← entry: API + serve dist/ em produção
│   ├── db.ts · schema.sql      ← SQLite (node:sqlite)
│   ├── routes/                 ← chat (SSE), sessions, objectives
│   ├── lib/
│   │   ├── engine.ts           ← seletor motor real vs mock
│   │   ├── anthropic.ts        ← motor real (Claude streaming + tools)
│   │   ├── mock.ts             ← motor mock (conversa scriptada offline)
│   │   ├── bia.ts              ← system prompt (3 fases) + ferramentas
│   │   ├── store.ts            ← persistência (SQLite, com dedup)
│   │   ├── risk-profile.ts · smart-score.ts · env.ts · types.ts
│   └── scripts/
│       ├── reset-db.ts         ← npm run db:reset
│       └── analyze.ts          ← npm run analyze (análise de logs)
├── src/                        ← frontend (React)
│   ├── pages/                  ← Landing, Workspace
│   ├── components/
│   │   ├── ChatView.tsx        ← a conversa WhatsApp
│   │   ├── AppView.tsx         ← o app "Meus Objetivos"
│   │   ├── JourneyProgress.tsx ← stepper das 3 fases
│   │   ├── BiaAvatar.tsx       ← avatar (headset, ref. logo BIA)
│   │   ├── chat/ · cards/ · phone/
│   ├── hooks/ · store/ · lib/ · types/
├── data/                       ← bia.db (SQLite) — criado no startup, fora do git
└── dist/                       ← build do frontend
```

---

## 🔌 API

| Rota | O que faz |
|---|---|
| `POST /api/sessions` | Cria sessão, semeia as mensagens de abertura. |
| `GET /api/sessions/:id` | Estado da sessão. |
| `PATCH /api/sessions/:id` | Atualiza status (`completed` / `abandoned`). |
| `POST /api/chat` | Body `{ session_id, messages }`. Resposta: **stream SSE** — `text`, `objective_registered`, `education_note`, `cross_sell`, `out_of_scope_note`, `error`, `done`. |
| `GET /api/objectives?session_id=X` | Objetivos + conceitos + cross-sell + notas fora de escopo. |
| `GET /api/health` | `{ ok, mode: 'mock'|'claude', model }`. |

### Ferramentas do agente (tool use)
- `register_objective` — registra/atualiza um objetivo (dedup por categoria).
- `register_education_note` — registra um conceito de educação financeira.
- `register_cross_sell` — registra (em silêncio) uma oportunidade comercial (dedup por produto).
- `register_out_of_scope_note` — anota algo para a etapa de planejamento financeiro.

---

## 🗄️ Banco (SQLite)

Tabelas: `sessions`, `messages`, `objectives`, `education_topics`,
`cross_sell_opportunities`, `out_of_scope_notes`. Schema em `server/schema.sql`,
aplicado automaticamente no startup. Para zerar: `npm run db:reset`.

---

## 📊 Análise de logs

```powershell
npm run analyze
```

Lê o banco e reporta métricas para melhorar a conversa: taxa de conclusão,
turnos até o 1º objetivo, completude SMART média, distribuição de categorias e
perfis, oportunidades de cross-sell mais frequentes, e **sugestões automáticas**
(ex.: "Fase 2 longa demais", "demora muitos turnos até o 1º objetivo").

---

## 🎴 Lógica de negócio

**Perfil de risco do objetivo** (não é suitability do cliente) — tabela
horizonte × flexibilidade; reserva de emergência é sempre conservador.

**Completude SMART** — checklist 0–100 (Específico, Mensurável, Alcançável,
Relevante, Temporal). Objetivo "pronto" com ≥ 80%.

**Deduplicação** — objetivos são únicos por categoria (exceto `outro`);
cross-sell é único por produto. Evita duplicatas quando o LLM repete chamadas.

Tudo calculado no servidor a cada `register_objective`.

---

## 📜 Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Vite + servidor, hot reload. |
| `npm run build` | Type-check (tsc) + build do frontend. |
| `npm start` | Servidor único servindo frontend + API. |
| `npm run typecheck` | Só o type-check. |
| `npm run db:reset` | Apaga o banco SQLite local. |
| `npm run analyze` | Análise de logs das conversas. |
