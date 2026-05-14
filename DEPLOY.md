# Deploy v1 — Bia · Bradesco

Checklist ordenado pra subir o piloto e validar end-to-end.
Cada etapa só depende das anteriores — não pule.

---

## ✅ 0. Pré-requisitos

- [ ] **Node.js LTS** instalado (verifique: `node --version` ≥ 20)
  ```powershell
  winget install OpenJS.NodeJS.LTS
  # feche e reabra o terminal
  ```
- [ ] **Git** instalado (já tem — version 2.54)
- [ ] **GitHub CLI** autenticado (já feito nesta sessão)
- [ ] Conta em [supabase.com](https://supabase.com) (free tier serve)
- [ ] Conta em [netlify.com](https://app.netlify.com)
- [ ] API key da Anthropic em [console.anthropic.com](https://console.anthropic.com)

---

## 🗄️ 1. Supabase — criar projeto e rodar migration

1. [ ] Em https://supabase.com/dashboard → **New project**
   - Name: `bia-bradesco-demo`
   - Database password: gere e **anote** (não vai precisar agora mas guarde)
   - Region: South America (São Paulo) — mais perto, menor latência
   - Plan: Free
2. [ ] Aguarde ~2 min até o projeto subir
3. [ ] **SQL Editor** → New query → cole o conteúdo de `supabase/migrations/001_initial_schema.sql` → **Run**
   - Deve aparecer "Success. No rows returned"
   - Verifique em **Table editor** que existem 4 tabelas: `sessions`, `messages`, `objectives`, `out_of_scope_notes`
4. [ ] **Settings → API** — copie estes 3 valores (vai colar no Netlify depois):
   - `Project URL` → será `SUPABASE_URL` e `VITE_SUPABASE_URL`
   - `Project API keys → anon public` → será `VITE_SUPABASE_ANON_KEY`
   - `Project API keys → service_role` → será `SUPABASE_SERVICE_ROLE_KEY` (**NUNCA commitar**)

---

## 🌐 2. Netlify — conectar GitHub e configurar build

1. [ ] Em https://app.netlify.com → **Add new site → Import an existing project**
2. [ ] **Deploy with GitHub** → autorize o app Netlify se for a primeira vez
3. [ ] Escolha o repo `bia-bradesco` (o que acabamos de criar)
4. [ ] **Site name**: `bia-bradesco-demo` (ou personalize)
5. [ ] **Build settings** (Netlify detecta sozinho, mas confira):
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. [ ] **NÃO clique Deploy ainda** — abra **Show advanced** e adicione as env vars (próximo passo)

---

## 🔐 3. Variáveis de ambiente no Netlify

Em **Site settings → Environment variables → Add a variable**, adicione **uma por uma**:

| Nome | Valor | Vem de |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | console.anthropic.com |
| `ANTHROPIC_MODEL` | `claude-opus-4-7` | (literal) |
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase Settings → API (service_role) |
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | mesmo do SUPABASE_URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Settings → API (anon public) |

> ⚠️ **NUNCA** confunda `anon` com `service_role`. A service role é admin e ignora RLS.

- [ ] Todas as 6 variáveis configuradas
- [ ] Clique **Deploy site**
- [ ] Aguarde o primeiro deploy (~2 min) e abra a URL pública

---

## 🧪 4. Smoke test pós-deploy

Abra a URL do Netlify (ex.: `https://bia-bradesco-demo.netlify.app`) e teste:

- [ ] Tela 1 (Landing) aparece dentro do frame de iPhone 17 Pro Max (desktop)
- [ ] Clique **Conversar com a Bia** → cria sessão e abre Tela 2
- [ ] As **2 mensagens de abertura** aparecem em sequência com delay (~1.5s entre)
- [ ] Responda "sim, bora!" → Bia faz a primeira pergunta de descoberta
- [ ] Conversa flui: descreva um objetivo concreto (ex.: "casa própria em SP, ~500 mil, em 7 anos")
- [ ] **Mini-card aparece no drawer** após a Bia confirmar o objetivo
- [ ] Repita pra 2-3 objetivos
- [ ] Bia eventualmente sinaliza encerramento → botão **"Ver meus objetivos"** aparece
- [ ] Clique nele → Tela 3 (Dashboard) abre com cards completos
- [ ] Expanda um card → vê os detalhes (modalidade, flexibilidade, etc.)
- [ ] **Exportar JSON** baixa um `.json` com os objetivos
- [ ] **Reiniciar** volta pra Landing
- [ ] Verifique no Supabase **Table editor**:
  - `sessions` tem o registro com status `completed`
  - `messages` tem todos os turnos (openers, user, assistant)
  - `objectives` tem os cards com `perfil_risco_sugerido` e `completude_score` preenchidos

---

## 🐛 5. Troubleshooting

| Sintoma | Causa provável | Resolução |
|---|---|---|
| Stream não inicia, network mostra 500 em `/api/chat` | `ANTHROPIC_API_KEY` errada/ausente | Reconfere variável e re-deploy |
| Sessão erro 500 ao clicar Start | `SUPABASE_SERVICE_ROLE_KEY` errada ou migration não rodou | Cheque tabelas no Supabase e service_role no Netlify |
| Mini-cards não aparecem | Tool use não executou | Abra DevTools → Network → `/api/chat` → procure linha `objective_registered` |
| 429 ao mandar mensagem | Rate limit de 20/sessão atingido | Reinicie a conversa |
| 429 ao criar sessão | 5 sessões/IP/dia atingido | Espere ou rode `UPDATE sessions SET client_ip = NULL` (debug) |
| Frame de iPhone não aparece | Tela < 768px (mobile real) | Comportamento esperado — abra em desktop pra ver |
| Build do Netlify falha em `tsc -b` | Erro de tipo TS | Veja log do build, geralmente é import faltando |

---

## 📋 6. O que ainda não foi testado nesta primeira passada

- ⏳ **Build local** (precisa de Node — rode `npm install && npm run build` localmente antes do push se quiser garantir)
- ⏳ **Type check** (`npm run typecheck`)
- ⏳ **`netlify dev`** local antes de subir produção
- ⏳ Mobile real (iOS Safari, Android Chrome)
- ⏳ Sessão com 4-5 objetivos completos (teste end-to-end longo)
- ⏳ Volume / concorrência (não relevante para piloto)

Recomendado fazer ao menos o **build local** + smoke test em `netlify dev` antes de divulgar a URL.

---

## 🔁 7. Workflow de iteração

A partir daqui, qualquer mudança:

```powershell
# editar arquivos
git add -A
git commit -m "ajuste X"
git push
# Netlify auto-deploys em ~1-2 min
```

Para iterar localmente:

```powershell
npm install
Copy-Item .env.example .env  # se ainda não tem
# preencha .env com as MESMAS vars do Netlify
netlify dev  # http://localhost:8888
```
