# Currículo CFP — estado e organização

Esqueleto extraído do **Programa Detalhado do Exame da Certificação CFP®** (Planejar,
edição mai/2026) [F1.3]. São **8 módulos** (não 6 — a edição vigente inclui Gestão
Financeira e Psicologia como módulos próprios):

| Módulo | Peso | Diretório |
|---|---:|---|
| 1. Planejamento Financeiro: Princípios, Processos e Habilidades | 13% | `01-planejamento-principios/` |
| 2. Gestão Financeira | 14% | `02-gestao-financeira/` |
| 3. Planejamento de Investimentos e Gestão de Ativos | 17% | `03-investimentos-gestao-ativos/` |
| 4. Planejamento de Aposentadoria | 12% | `04-aposentadoria/` |
| 5. Planejamento de Seguros e Gestão de Risco | 12% | `05-seguros-gestao-risco/` |
| 6. Planejamento Tributário | 12% | `06-planejamento-tributario/` |
| 7. Planejamento patrimonial e sucessório | 12% | `07-patrimonial-sucessorio/` |
| 8. Psicologia no Planejamento Financeiro | 7% | `08-psicologia/` |

*A soma impressa no documento é 99% — presumivelmente arredondamento; mantida como está
na fonte, sem "corrigir".*

## O que já existe vs. o que falta

- **Existe**: `ementa.md` por módulo (o mapa oficial de tópicos, 1.501 itens),
  `00-processo-6-etapas.md` e `conceitos-fundamentais.md` (notas educáveis ao cliente).
- **Falta (fase seguinte)**: as **notas de estudo por tópico** — um arquivo por tópico
  `N.N`, autoral (~150–300 palavras), com fonte primária (lei, CVM, SUSEP, Previc, RFB),
  `fase_bia` e tags. Produção prevista por workflow multi-agente com auditoria
  adversarial contra a ementa (padrão do projeto Vision).

## Regras deste diretório

1. **Nada de cópia de courseware** (apostilas/livros são protegidos). A ementa é o mapa
   factual; as notas são redação própria com fontes primárias citadas.
2. Todo arquivo carrega front-matter (`id`, `modulo`, `topico`, `tags`, `fase_bia`,
   `fonte`, `flags`, `status`) — validado por `npm run kb:check`.
3. `fase_bia: cliente` só para conteúdo que a Bia pode ensinar na Etapa 2 (educação
   financeira). Tributação/produto → `interna` ou `etapa3`.
