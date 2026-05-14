# Bia · Bradesco — Planejamento de Objetivos (Demo)

Demo web que simula a jornada de um cliente Bradesco descobrindo e
estruturando seus **objetivos de vida** via WhatsApp-like chat com a
assistente virtual **Bia**.

> ⚠️ **Demonstração técnica.** Não é o atendimento oficial do Bradesco.

---

## 🎯 O que ele faz

| Fronteira | Definição |
|---|---|
| **Início** | Landing com botão "Conversar com a Bia". Sem login. |
| **Conversa** | Apenas descoberta e estruturação de objetivos (metodologia CFP). |
| **Fim** | Cards estruturados com target, prazo, prioridade, perfil de risco do objetivo, completude SMART. |

Fora de escopo: fluxo de caixa, alocação, recomendação de produto, suitability.

---

## 🧱 Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind + Zustand
- **Backend**: Netlify Edge Functions (Deno) — proxy seguro para Anthropic
- **Banco**: Supabase Postgres + RLS
- **LLM**: Anthropic API (`claude-opus-4-7`) com streaming SSE + tool use

`ANTHROPIC_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY` ficam **apenas no servidor**.

---

## 🚀 Setup local (Windows)

### 1. Pré-requisitos

```powershell
# Node.js LTS (22.x)
winget install OpenJS.NodeJS.LTS

# Netlify CLI (depois que o npm estiver disponível)
npm install -g netlify-cli
```

Feche e reabra o terminal depois do `winget install` para o PATH ser atualizado.

### 2. Instalar dependências

```powershell
cd C:\Users\artur\bia-bradesco
npm install
```

### 3. Configurar Supabase

1. Crie um projeto em https://supabase.com (free tier serve).
2. Em **SQL Editor**, abra `supabase/migrations/001_initial_schema.sql` deste repo e execute o conteúdo inteiro.
3. Em **Settings → API**, copie:
   - `Project URL` → `SUPABASE_URL` e `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (**nunca commitar**)

### 4. Anthropic API key

Em https://console.anthropic.com → API keys → create. Copie para `ANTHROPIC_API_KEY`.

### 5. Variáveis de ambiente

Copie o template e preencha:

```powershell
Copy-Item .env.example .env
notepad .env
```

### 6. Rodar

```powershell
# Frontend isolado (sem Edge Functions)
npm run dev
# → http://localhost:5173 (chat não vai funcionar, pra checar UI apenas)

# Stack completo (frontend + Edge Functions)
npm run dev:netlify
# → http://localhost:8888
```

`netlify dev` carrega o `.env` automaticamente e proxia `/api/*` para as Edge Functions.

---

## 🌐 Deploy no Netlify

1. Faça push deste repo pro GitHub.
2. Em https://app.netlify.com, **Add new site → Import from Git**.
3. Conecte o repo. Build command: `npm run build`. Publish: `dist`.
4. Em **Site settings → Environment variables**, adicione todas as variáveis do `.env` (exceto `VITE_*` que viram públicas — adicione mesmo assim).
5. Deploy.

As Edge Functions em `netlify/edge-functions/` são detectadas automaticamente.

---

## 🗺️ Fluxo

```
[1] Landing → POST /api/sessions
[2] Chat   → POST /api/chat (SSE com text + tool_use events)
[3] Dashboard → GET /api/objectives + PATCH /api/sessions/:id (completed)
```

---

## 🔌 API

### `POST /api/sessions`
Cria sessão. Retorna `{ id, started_at, status, opening_messages: [...] }`.
As mensagens de abertura são pré-inseridas em `messages` para auditoria.

### `POST /api/chat`
**Body**: `{ session_id, messages: [{role, content}, ...] }` — histórico completo da conversa.
**Resposta**: stream SSE com eventos:
- `{type:"text", delta:"..."}` — texto incremental do assistente
- `{type:"objective_registered", objective:{...}}` — objetivo criado/atualizado via tool
- `{type:"out_of_scope_note", nota:"..."}` — anotação fora de escopo
- `{type:"error", message:"..."}` — erro
- `{type:"done"}` — fim do stream

A última mensagem do array deve ser `role:"user"`.

### `GET /api/objectives?session_id=X`
Retorna `{ objectives: [...] }`.

### `PATCH /api/sessions/:id`
**Body**: `{ status: "completed" | "abandoned" }`. Calcula `duration_minutes`.

---

## 🚦 Rate limiting

- **20 mensagens de usuário por sessão**
- **5 sessões por IP nas últimas 24h**

Implementado em `netlify/edge-functions/_shared.ts` via queries no Supabase.

---

## 🎴 Lógica dos cards

### Perfil de risco do objetivo
Calculado server-side a cada `register_objective`. Reserva de emergência é
sempre conservador. Tabela em `src/lib/risk-profile.ts` (espelhada em
`netlify/edge-functions/_shared.ts`).

| Horizonte | Flexibilidade | Perfil |
|---|---|---|
| < 2 anos | qualquer | 🟢 Conservador |
| 2–5 anos | rígido / flexível | 🟢 / 🟡 |
| 5–10 anos | rígido / flexível | 🟡 / 🟠 |
| > 10 anos | qualquer | 🔴 Arrojado |

### Completude SMART
Checklist 0–100 (20 pontos cada): Específico, Mensurável, Alcançável, Relevante, Temporal.
Card pronto para handoff: ≥ 80%.

---

## 🔐 Segurança

- `ANTHROPIC_API_KEY` e `SUPABASE_SERVICE_ROLE_KEY` **só ficam no servidor** (Edge Functions).
- Front nunca chama Anthropic ou Supabase admin diretamente.
- RLS habilitado em todas as tabelas com **policies vazias** (default-deny). Service role bypassa RLS.
- v2: adicionar Supabase Auth + policies por `user_id`.

---

## 📁 Estrutura

```
bia-bradesco/
├── netlify/edge-functions/    ← backend (Deno)
│   ├── _shared.ts             ← supabase admin, rate limit, business logic
│   ├── chat.ts                ← streaming SSE + tool use
│   ├── sessions.ts            ← POST/PATCH/GET de sessões
│   └── objectives.ts          ← GET de objetivos
├── src/
│   ├── components/            ← chat, cards, BiaAvatar
│   ├── hooks/                 ← useChat, useObjectivesSync
│   ├── lib/                   ← risk-profile, smart-score, bia-prompt, utils
│   ├── pages/                 ← Landing, Chat, Dashboard
│   ├── store/                 ← Zustand store com persist
│   └── types/                 ← Objective, etc.
├── supabase/migrations/       ← schema SQL
└── netlify.toml               ← config do Netlify
```

---

## ✅ Critérios de aceite

- [x] 3 telas (Landing, Chat, Dashboard) com fluxo completo
- [x] Mensagem de abertura em duas partes com delay (`opening_messages` + `setTyping`)
- [x] Bia respeita escopo (system prompt + redirecionamento cordial + `register_out_of_scope_note`)
- [x] Tool use `register_objective` com cálculo server-side de perfil/completude/ano_alvo
- [x] Painel progressivo de mini-cards (lateral no desktop, drawer no mobile)
- [x] Dashboard com cards expansíveis
- [x] Exportar JSON + Reiniciar
- [x] Reserva de emergência: o system prompt instrui a Bia a sugerir proativamente
- [x] Histórico persistido em `messages` (openers + user + final assistant text)
- [x] RLS habilitada (default-deny)
- [x] Rate limiting (20 msg/sessão, 5 sessões/IP/dia)
- [x] `ANTHROPIC_API_KEY` apenas server-side
- [x] Responsivo (mobile 375px e desktop com side panel)

---

## 🪛 Próximos passos / v2

- Supabase Auth + RLS por `user_id`
- Sentry para erros (variável já está no `.env.example`)
- PostHog para funil de conversão (variável já está no `.env.example`)
- A/B no roteiro de abertura
- Suporte a anexos (foto da casa dos sonhos, etc.) — fora do escopo deste piloto
- Integração com CRM Bradesco para handoff real ao planejador
