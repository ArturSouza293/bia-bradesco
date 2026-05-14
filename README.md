# Bia · Bradesco — Demo offline

App **local e offline** que testa a **Bia**, um agente de IA que guia o cliente
por uma jornada de **cadastro de objetivos de vida** + **educação financeira
básica** — e ao final o encaminha para a próxima etapa: o **planejamento
financeiro** (fluxo de caixa futuro), que é a fronteira final deste caso de uso.

> ⚠️ Demonstração técnica. Não é o atendimento oficial do Bradesco.

---

## 🎯 A jornada (fluxo de negócio)

```
[1] Landing  →  [2] Chat com a Bia  →  [3] Dashboard
                      │
                      ├─ descobre e estrutura objetivos de vida (metodologia SMART)
                      ├─ dá educação financeira básica no contexto da conversa
                      └─ ao final, encaminha para o PLANEJAMENTO FINANCEIRO
                         (fluxo de caixa futuro) — fronteira final
```

| Fronteira | Definição |
|---|---|
| **Entrada** | Landing com "Conversar com a Bia". Sem login. |
| **Escopo** | Descoberta de objetivos (SMART) + educação financeira básica. |
| **Fora de escopo** | Fluxo de caixa, alocação, produtos, suitability — anotados para a próxima etapa. |
| **Saída** | 3–5 objetivos estruturados + conceitos explicados, prontos para o planejamento financeiro. |

---

## 🧱 Arquitetura — tudo local

```
┌─────────────────┐   /api/*    ┌──────────────────────┐
│  Frontend        │ ──────────▶ │  Servidor Express     │
│  React + Vite    │  (proxy)    │  (Node, porta 3001)   │
│  iPhone mockup   │ ◀────────── │   ├─ motor real/mock  │
└─────────────────┘   SSE        │   └─ SQLite (node:sqlite)
                                 └──────────────────────┘
                                            │
                              internet só p/ o motor Claude real
```

- **Frontend**: React 18 + TypeScript + Vite + Tailwind + Zustand. UI estilo
  WhatsApp dentro de um mockup de iPhone 17 Pro Max (no mobile vira fullscreen).
- **Backend**: servidor Express local. **SQLite via `node:sqlite`** (embutido no
  Node 22.5+, **zero dependências nativas** — roda offline sem build tools).
- **Dois motores de conversa**:
  - **mock** — conversa scriptada, **100% offline**, sem internet e sem custo.
    Testa todo o design + fluxo + banco.
  - **claude** — motor real (`claude-opus-4-7`) com streaming SSE e tool use.
    Só este precisa de internet.
  - A escolha é automática: sem `ANTHROPIC_API_KEY` válida (ou `MOCK_LLM=true`)
    → mock. Com a key → Claude real.

Não há nada na nuvem. Não há deploy. É um projeto Git com banco que roda na
sua máquina.

---

## 🚀 Como rodar

### Pré-requisito
- **Node.js 22.5+** (testado no 24). Nada mais — sem Postgres, sem Docker.

### Instalar
```powershell
npm install
```

### Configurar
```powershell
Copy-Item .env.example .env
# Edite .env:
#  - deixe ANTHROPIC_API_KEY vazia (ou MOCK_LLM=true)  → roda 100% offline (mock)
#  - preencha ANTHROPIC_API_KEY                         → usa o Claude real
```

### Desenvolvimento (hot reload)
```powershell
npm run dev
# Vite (frontend) em http://localhost:5173  + servidor em :3001
# Abra http://localhost:5173
```

### App offline (processo único)
```powershell
npm run build
npm start
# Servidor serve o frontend + a API em http://localhost:3001
```

---

## ⚙️ Configuração (`.env`)

| Variável | Para quê |
|---|---|
| `ANTHROPIC_API_KEY` | Key do Claude. **Vazia = modo mock (offline).** |
| `ANTHROPIC_MODEL` | Modelo (padrão `claude-opus-4-7`). |
| `PORT` | Porta do servidor (padrão `3001`). |
| `MOCK_LLM` | `true` força o mock mesmo com a key presente. |

O `.env` é lido pelo próprio servidor (com override) — funciona independente de
como o processo é iniciado.

---

## 📁 Estrutura

```
bia-bradesco/
├── server/                     ← backend local (Node + Express)
│   ├── index.ts                ← entry: API + serve dist/ em produção
│   ├── db.ts                   ← SQLite (node:sqlite)
│   ├── schema.sql              ← schema do banco (aplicado no startup)
│   ├── routes/
│   │   ├── chat.ts             ← POST /api/chat — streaming SSE + tool use
│   │   ├── sessions.ts         ← POST/GET/PATCH /api/sessions
│   │   └── objectives.ts       ← GET /api/objectives
│   ├── lib/
│   │   ├── engine.ts           ← seletor motor real vs mock
│   │   ├── anthropic.ts        ← motor real (Claude streaming + tools)
│   │   ├── mock.ts             ← motor mock (conversa scriptada offline)
│   │   ├── bia.ts              ← system prompt + ferramentas + openers
│   │   ├── store.ts            ← persistência (todas as queries SQLite)
│   │   ├── risk-profile.ts     ← perfil de risco do objetivo
│   │   ├── smart-score.ts      ← completude SMART
│   │   ├── env.ts              ← carregador de .env (com override)
│   │   └── types.ts
│   └── scripts/reset-db.ts     ← npm run db:reset
├── src/                        ← frontend (React)
│   ├── pages/                  ← Landing, Chat, Dashboard
│   ├── components/             ← chat/, cards/, phone/ (mockup iPhone)
│   ├── hooks/, store/, lib/, types/
├── data/                       ← bia.db (SQLite) — criado no startup, fora do git
└── dist/                       ← build do frontend (npm run build)
```

---

## 🔌 API

| Rota | O que faz |
|---|---|
| `POST /api/sessions` | Cria sessão, semeia as mensagens de abertura. |
| `GET /api/sessions/:id` | Estado da sessão. |
| `PATCH /api/sessions/:id` | Atualiza status (`completed` / `abandoned`). |
| `POST /api/chat` | Body `{ session_id, messages }`. Resposta: **stream SSE** com eventos `text`, `objective_registered`, `education_note`, `out_of_scope_note`, `error`, `done`. |
| `GET /api/objectives?session_id=X` | Objetivos + conceitos de educação + notas fora de escopo. |
| `GET /api/health` | `{ ok, mode: 'mock'|'claude', model }`. |

### Ferramentas do agente (tool use)
- `register_objective` — registra/atualiza um objetivo. O servidor calcula
  perfil de risco, completude SMART e ano-alvo.
- `register_education_note` — registra um conceito de educação financeira explicado.
- `register_out_of_scope_note` — anota algo para a etapa de planejamento financeiro.

---

## 🗄️ Banco (SQLite)

Tabelas: `sessions`, `messages`, `objectives`, `education_topics`,
`out_of_scope_notes`. Schema completo em `server/schema.sql`, aplicado
automaticamente no startup. Para zerar: `npm run db:reset`.

---

## 🎴 Lógica de negócio

**Perfil de risco do objetivo** (não é suitability do cliente) — tabela
horizonte × flexibilidade; reserva de emergência é sempre conservador.

**Completude SMART** — checklist 0–100 (Específico, Mensurável, Alcançável,
Relevante, Temporal). Objetivo "pronto" com ≥ 80%.

Ambos calculados no servidor a cada `register_objective`.

---

## 📜 Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | Vite + servidor, hot reload. |
| `npm run build` | Type-check (tsc) + build do frontend. |
| `npm start` | Servidor único servindo frontend + API. |
| `npm run typecheck` | Só o type-check. |
| `npm run db:reset` | Apaga o banco SQLite local. |
