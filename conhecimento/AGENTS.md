# Conhecimento da Bia — constituição do cérebro

Este diretório é o **segundo cérebro** da Bia: todo o conhecimento que alimenta o agente
vive AQUI, versionado em git — nunca hard-coded no código. O runtime consome artefatos
**gerados** a partir daqui (`npm run kb:build` → `server/kb/*.generated.ts`).

## Mapa

| Onde | O quê |
|---|---|
| `curriculo-cfp/` | Currículo CFP (Planejar): ementas dos 8 módulos + notas de estudo autorais |
| `matriz-produtos/` | Matriz de 66 produtos × duração × tributação (origem: projeto Vision) |
| `persona/` | O system prompt da Bia, fatiado em blocos versionados |
| `inbox/` | Material novo AINDA NÃO processado (não entra no build) |
| `fontes.md` | Registro de fontes citável — `[F1.n]` |
| `INDEX.md` | Catálogo navegável |

## Regra Zero (herdada do projeto Vision)

1. **Nenhum fato sem fonte.** Todo arquivo declara `fonte:` (id de `fontes.md`); toda
   afirmação numérica no corpo cita a fonte. Sem fonte → não entra.
2. **Flags nunca são removidas para embelezar**: `[FONTE INTERNA]`, `[A CONFIRMAR]`,
   `[FONTE ÚNICA]`, `DADOS ILUSTRATIVOS`. Elas viajam com o conteúdo até o runtime.
3. **Nada se apaga**: revisão substitui com registro (o arquivo antigo ganha aviso de
   superado no topo e o novo o referencia), histórico fica no git.
4. **Direito autoral**: a ementa da Planejar é o mapa factual; apostilas/livros de
   preparação são protegidos — todo texto aqui é **redação própria** com fontes primárias
   (lei, CVM, SUSEP, Previc, RFB).

## Front-matter obrigatório (validado por `npm run kb:check`)

```yaml
id: unico-no-cerebro          # vira o prefixo do chunk: "id#slug-da-secao"
modulo: curriculo | matriz | persona
topico: "título humano"
tags: [lista, de, tags]        # usadas como boost na busca
fase_bia: cliente | interna | etapa3
fonte: F1.n                    # id em fontes.md
flags: []                      # flags que viajam com os chunks
status: base | review
```

### O campo `fase_bia` é o guardrail central

- **`cliente`** — a Bia pode usar E citar na conversa da Etapa 2 (educação financeira).
  É o ÚNICO nível que a ferramenta `consultar_conhecimento` devolve.
- **`interna`** — lente de gerente: fundamenta `register_cross_sell` e
  `register_out_of_scope_note` via `consultar_produto`. NUNCA citado ao cliente.
- **`etapa3`** — reservado para a próxima etapa do produto (planejamento financeiro).

A matriz de produtos é `interna` por decisão registrada no cérebro do Vision
([dec-rag-bia-cfp-aprovado], 06/08/2026): a Etapa 2 não faz recomendação de produto nem
tributação ao cliente.

## Chunking (como o build lê os arquivos)

- Cada seção `###` de um arquivo `.md` vira um chunk recuperável
  (`id#slug-do-titulo`); arquivos sem `###` viram um chunk único.
- Alvo: 200–600 tokens por chunk — uma ideia por seção, título descritivo.
- `ementa.md`, `matriz.md`, `fonte/` e `inbox/` não geram chunks de busca (são mapa,
  dado estruturado e material bruto, respectivamente).

## Fluxo de manutenção

1. Material novo cai em `inbox/`.
2. Curadoria: reescrever no formato acima, catalogar em `fontes.md` + `INDEX.md`.
3. `npm run kb:build` (regenera `server/kb/*.generated.ts` — commitados).
4. `npm run kb:check` (CI bloqueia PR com cérebro inválido ou gerados desatualizados).

## Proveniência da matriz

`matriz-produtos/` é **cópia com proveniência** (v0.3, jul/2026) do acervo do projeto
Vision (`vision-agents`), que mantém a custódia. Se a origem evoluir, re-importar
`fonte/vision_tax_duration_matrix.jsx` e regenerar (`node scripts/kb/extract-matriz.mjs`).
