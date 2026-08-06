---
id: m3-3-5-medicao-de-desempenho-e-risco
modulo: curriculo
topico: "3.5 Medição de desempenho e risco"
tags: [modulo-3, indices-de-desempenho, sharpe-treynor-sortino, value-at-risk, benchmark, gestao-de-risco]
fase_bia: etapa3
fonte: F1.4
flags: []
status: review
---

# 3.5 Medição de desempenho e risco

> Depois de montar a carteira, é preciso medir se ela está entregando o que promete —
> ajustando o retorno observado pelo risco assumido e pelos custos envolvidos, e
> comparando-o com referências de mercado adequadas.

### Avaliação de desempenho: comissões, encargos e retorno ponderado

Avaliar o desempenho de uma carteira não é olhar apenas o retorno bruto: uma questão
central é entender o que exatamente está sendo medido e comparado — período, benchmark,
moeda e critério de ponderação usados na análise, já que escolhas diferentes nesses pontos
podem levar a conclusões distintas sobre o mesmo resultado. As **implicações das comissões
e encargos** são igualmente centrais: taxas de administração, de performance, corretagem e
outros custos reduzem o retorno líquido efetivamente recebido, e ignorá-las na comparação
entre alternativas infla artificialmente o resultado aparente de uma estratégia. A forma de
calcular o retorno também importa: o **retorno ponderado pelo tempo (time-weighted)**
neutraliza o efeito de aportes e resgates feitos pelo investidor, isolando exclusivamente o
desempenho da gestão — a métrica correta para comparar gestores entre si. Já o **retorno
ponderado pelo valor/moeda (money-weighted)**, mais próximo de uma taxa interna de retorno,
reflete o resultado efetivamente vivido pelo investidor, incluindo o impacto de quando
aportou ou resgatou — a métrica correta para avaliar a experiência real daquele investidor,
que pode diferir bastante do retorno "puro" do fundo.

### Índices de desempenho ajustado ao risco: Sharpe, Treynor e Sortino

Comparar retornos brutos entre carteiras esconde uma informação essencial: quanto risco foi
assumido para obter aquele resultado. O **Índice de Sharpe** divide o retorno excedente da
carteira (acima do ativo livre de risco) pelo desvio-padrão dos seus retornos — quanto
maior, mais retorno por unidade de risco total assumido, sendo o indicador mais usado para
comparar gestores entre si. O **Índice de Treynor** segue lógica parecida, mas usa o
**beta** (risco sistemático) no denominador em vez do desvio-padrão (risco total) — mais
adequado para carteiras já bem diversificadas, nas quais o risco não sistemático foi
praticamente eliminado. Já o **Índice de Sortino** refina o Sharpe ao considerar, no
denominador, apenas a volatilidade dos retornos negativos (downside deviation), partindo da
premissa de que o investidor se importa mais com a oscilação que gera perda do que com a
que gera ganho acima do esperado.

### Expectativas do mercado de capitais e beta

Formar **expectativas do mercado de capitais** significa projetar, para cada classe de
ativo, um retorno esperado, uma volatilidade esperada e as correlações esperadas entre
elas — o insumo necessário para qualquer exercício de alocação ou otimização de carteira, e
um dos exercícios mais delicados do planejamento, por depender de premissas sobre o futuro
que raramente se confirmam exatamente como projetadas. Um componente central dessas
expectativas é o **prêmio de mercado**: o retorno adicional esperado em uma classe de risco
(como ações) acima do ativo livre de risco, como compensação por assumir esse risco. Nesse
contexto o **beta** volta a ser central: é o elo entre a expectativa de retorno de mercado
como um todo e a expectativa de retorno de um ativo específico, permitindo estimar quanto
do prêmio de mercado esperado deve, teoricamente, ser incorporado ao retorno esperado
daquele ativo em particular.

### Gestão e mensuração de risco: VaR, stress test e duration

Além dos índices ajustados ao risco, a gestão profissional usa ferramentas específicas de
mensuração e controle. O **Value at Risk (VaR)** estima a perda máxima esperada de uma
carteira, em um horizonte de tempo definido e com determinado nível de confiança
estatístico, em condições normais de mercado. O **stress test** complementa o VaR simulando
cenários extremos para verificar o comportamento da carteira fora das condições "normais"
que o VaR pressupõe. O **stop loss** é uma regra operacional: uma ordem predefinida para
encerrar automaticamente uma posição perdedora ao atingir determinado patamar de prejuízo.
Em renda fixa, o **risco de reinvestimento** (reaplicar cupons ou vencimentos em condições
de juros piores) e o **risco de resgate antecipado** (ligado à liquidez do título antes do
vencimento) merecem atenção específica. A **duration** mede o prazo médio ponderado dos
fluxos de um título e sua sensibilidade ao movimento das taxas de juros; a **duration
modificada** ajusta esse cálculo para estimar a variação percentual esperada no preço do
título diante de uma variação na taxa de juros. A **imunização de carteira** casa a duration
dos ativos com a duration de obrigações futuras, para neutralizar o impacto de oscilações de
juros sobre o objetivo final.

### Principais índices de referência: renda fixa e renda variável

Avaliar se uma carteira ou gestor performa bem exige compará-la a um **benchmark** adequado
à estratégia. Em **renda fixa**, a família de índices da ANBIMA acompanha diferentes
indexadores: o **IRF-M** acompanha títulos **prefixados**; o **IMA-B**, indexados ao
**IPCA**; o **IMA-C**, indexados ao **IGP-M** [A CONFIRMAR — composição atual]; e o
**IMA-S**, **pós-fixados atrelados à Selic** — cada um também representado por **carteiras
teóricas** que replicam sua composição, servindo de referência para fundos com mandato
correspondente. Em **renda variável**, o **Ibovespa** é o principal índice brasileiro,
composto pelas ações mais negociadas na B3, e serve de benchmark padrão para a maioria dos
fundos e carteiras de ações locais. O **IBrX** e o **IBrX-50** seguem lógica semelhante, com
metodologia de ponderação e número de ativos diferentes. O **Índice Small Cap (SMLL)**
acompanha empresas de menor capitalização, e o **Índice de Dividendos (IDIV)** reúne
empresas com melhor histórico de pagamento de proventos. Escolher o benchmark errado —
comparar um fundo de small caps ao Ibovespa, por exemplo — distorce completamente a
avaliação de desempenho, mesmo com cálculos matematicamente corretos.
