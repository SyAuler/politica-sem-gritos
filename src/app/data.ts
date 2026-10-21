import { Candidate, Chamber, DebtFactorYear, Indicator, LawRecord, Scenario } from './models';
import { S, UPDATED_AT, src } from './fontes';

export { UPDATED_AT } from './fontes';
export { TOPICS, TOPIC_GROUPS } from './temas';

export const FIRST_ROUND = {
  date: '4 de outubro de 2026',
  runoff: '25 de outubro de 2026',
  runoffDate: '2026-10-25',
  results: [
    { id: 'flavio', name: 'Flávio Bolsonaro (PL)', pct: 47.03, votes: '56.104.503' },
    { id: 'lula', name: 'Lula (PT)', pct: 45.16, votes: '53.879.538' },
  ],
  note: 'Números oficiais da totalização do TSE (05/10/2026).',
  sources: [S.tsePresidente],
  rule: 'Disputam os dois mais votados no 1º turno. Vence quem tiver a maioria dos votos válidos — brancos e nulos não entram na conta.',
  ruleSources: [
    src(
      'Constituição Federal — art. 77 (eleição do Presidente da República)',
      'Planalto',
      'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
    ),
  ],
};

/** Ordem alfabética. A interface permite inverter as colunas. */
export const CANDIDATES: Candidate[] = [
  {
    id: 'flavio',
    name: 'Flávio Bolsonaro',
    party: 'PL',
    vice: 'Alfredo Gaspar',
    photo: {
      src: 'candidatos/flavio.jpg',
      credit: 'Foto oficial: Agência Senado (uso com atribuição)',
      url: 'https://commons.wikimedia.org/wiki/File:Foto_oficial_do_senador_Fl%C3%A1vio_Bolsonaro_(v._AgSen)_(3x4).jpg',
    },
    planTitle: '“Para o Brasil vencer o atraso”',
    planSummary:
      'Plano de 76 páginas registrado no TSE, organizado em nove eixos, de “Brasil sem Medo” a “Brasil que Não Volta Atrás”. O de custo de vida se chama “Brasil Mais Barato”.',
    background:
      'Senador pelo Rio de Janeiro desde 2019. Nunca ocupou cargo no Executivo: não há histórico próprio de governo para comparar. O governo de seu pai, Jair Bolsonaro (2019–2022), é referência do grupo político, não um resultado dele.',
    profile: [
      { label: 'Nascimento', value: '30/04/1981 (45 anos no dia do 2º turno)' },
      {
        label: 'Cargos eletivos',
        value:
          'Deputado estadual no Rio de Janeiro (2003–2019) e senador pelo Rio de Janeiro desde 2019',
      },
      {
        label: 'Experiência no Executivo',
        value: 'Nenhuma: nunca foi prefeito, governador ou presidente',
      },
    ],
    sources: [S.planoFlavio, S.tsePresidente, S.wikiFlavio],
  },
  {
    id: 'lula',
    name: 'Lula',
    party: 'PT',
    vice: 'Geraldo Alckmin (PSB)',
    photo: {
      src: 'candidatos/lula.jpg',
      credit: 'Foto oficial: Ricardo Stuckert/PR (CC BY 2.0)',
      url: 'https://commons.wikimedia.org/wiki/File:Foto_oficial_de_Luiz_In%C3%A1cio_Lula_da_Silva_(ombros)_denoise.jpg',
    },
    planTitle: '“Diretrizes para o Programa de Transformação do Brasil”',
    planSummary: 'Plano de 84 páginas registrado no TSE, organizado em 13 diretrizes.',
    background:
      'Presidente em três mandatos (2003–2006, 2007–2010 e 2023–2026). Há histórico próprio de governo, que pode ser comparado com os indicadores oficiais em “O que os dados mostram”, mais abaixo.',
    profile: [
      { label: 'Nascimento', value: '06/10/1945 (81 anos no dia do 2º turno)' },
      {
        label: 'Cargos eletivos',
        value:
          'Deputado federal constituinte por São Paulo (1987–1991) e presidente da República (2003–2010 e desde 2023)',
      },
      {
        label: 'Experiência no Executivo',
        value: '12 anos como presidente ao fim do mandato atual',
      },
    ],
    sources: [S.planoLula, S.tsePresidente, S.wikiLula],
  },
];

export const CHAMBERS: Chamber[] = [
  {
    id: 'camara',
    name: 'Câmara dos Deputados',
    total: 513,
    thresholds: [
      { label: 'Maioria absoluta', seats: 257, note: 'leis complementares e derrubada de veto' },
      { label: '3/5', seats: 308, note: 'emenda à Constituição (PEC)' },
    ],
    parties: [
      { party: 'PL', seats: 118, bloc: 'flavio' },
      { party: 'União–PP', seats: 85, bloc: 'flavio' },
      { party: 'Republicanos', seats: 41, bloc: 'flavio' },
      { party: 'Podemos', seats: 25, bloc: 'flavio' },
      { party: 'Novo', seats: 10, bloc: 'flavio' },
      { party: 'PSD', seats: 42, bloc: 'independente' },
      { party: 'MDB', seats: 36, bloc: 'independente' },
      { party: 'PSDB–Cidadania', seats: 11, bloc: 'independente' },
      { party: 'PRD–Solidariedade', seats: 7, bloc: 'independente' },
      { party: 'Avante', seats: 5, bloc: 'independente' },
      { party: 'Missão', seats: 1, bloc: 'independente' },
      { party: 'PT–PCdoB–PV', seats: 88, bloc: 'lula' },
      { party: 'PSB', seats: 15, bloc: 'lula' },
      { party: 'PSOL–Rede', seats: 15, bloc: 'lula' },
      { party: 'PDT', seats: 6, bloc: 'lula' },
    ],
    pending: 8,
    caveat:
      'Números oficiais do TSE. 8 vagas ainda não têm eleito definido porque dependem de candidaturas sub judice (sob julgamento); podem mudar até a diplomação.',
    sources: [S.tseResultados],
  },
  {
    id: 'senado',
    name: 'Senado Federal',
    total: 81,
    thresholds: [
      { label: 'Maioria absoluta', seats: 41, note: 'aprovar indicados ao STF e derrubar veto' },
      { label: '3/5', seats: 49, note: 'emenda à Constituição (PEC)' },
      { label: '2/3', seats: 54, note: 'condenar em processo de impeachment' },
    ],
    parties: [
      { party: 'PL', seats: 28, bloc: 'flavio' },
      { party: 'Republicanos', seats: 6, bloc: 'flavio' },
      { party: 'PP', seats: 6, bloc: 'flavio' },
      { party: 'União', seats: 5, bloc: 'flavio' },
      { party: 'Novo', seats: 3, bloc: 'flavio' },
      { party: 'Podemos', seats: 2, bloc: 'flavio' },
      { party: 'MDB', seats: 8, bloc: 'independente' },
      { party: 'PSD', seats: 5, bloc: 'independente' },
      { party: 'PSDB', seats: 2, bloc: 'independente' },
      { party: 'Sem partido', seats: 1, bloc: 'independente' },
      { party: 'PT', seats: 9, bloc: 'lula' },
      { party: 'PSB', seats: 4, bloc: 'lula' },
      { party: 'Rede', seats: 1, bloc: 'lula' },
      { party: 'PDT', seats: 1, bloc: 'lula' },
    ],
    caveat:
      'Soma dos 54 eleitos em 2026 (conferidos no TSE: PL 19, MDB 7, PT 6, PP, PSB, União e Novo 3 cada, Republicanos, PSDB, PSD e Podemos 2 cada, Rede e PDT 1 cada) com os 27 que seguem no mandato, segundo a imprensa. Suplentes e trocas de partido podem alterar os totais.',
    sources: [S.tseResultados, S.cnnSenado, S.agBrasilSenado],
  },
];

export const BLOC_NOTE = {
  text: 'Os blocos seguem a coligação de Lula registrada no TSE, “Brasil Pronto pra Mais” (PT, PCdoB, PV, PSB, PDT, PSOL e Rede), e os partidos que declararam apoio a Flávio no 2º turno (PL, União, PP, Republicanos, Podemos e Novo), segundo a imprensa. Apoio eleitoral não é voto garantido: partidos de centro costumam negociar com quem vencer, projeto a projeto.',
  sources: [S.tsePresidente, S.wiki, S.constituicao],
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'flavio',
    title: 'Se Flávio Bolsonaro vencer',
    reading:
      'Governo e Congresso do mesmo lado. O bloco que o apoia soma, no papel, 279 deputados e 50 senadores: passa da maioria absoluta nas duas Casas e alcança os 3/5 no Senado, mas fica 29 votos abaixo dos 308 necessários para emendar a Constituição na Câmara (há ainda 8 vagas indefinidas).',
    positives: [
      'Menos paralisia: projetos de lei comuns, orçamento e indicações tendem a andar mais rápido.',
      'Maior chance de a agenda prometida (impostos, segurança, privatizações) ser de fato votada, o que permite cobrar resultados.',
      'Menor risco de crises entre Executivo e Legislativo.',
    ],
    negatives: [
      'Menos freios: um Congresso alinhado fiscaliza menos, abre menos CPIs e aprova indicações com menos escrutínio.',
      'Mudanças no STF e em regras constitucionais ficam ao alcance com poucos votos de centro.',
      'Um bloco grande não é barato: o apoio costuma ser pago com emendas e cargos, o que dificulta a promessa de cortar gastos.',
    ],
  },
  {
    id: 'lula',
    title: 'Se Lula vencer',
    reading:
      'Governo dividido. A coligação de Lula soma 124 deputados e 15 senadores: precisaria de mais 133 deputados e 26 senadores só para a maioria absoluta. Um veto presidencial pode ser derrubado pelo bloco adversário.',
    positives: [
      'Mais freios: nada passa sem negociação, o que barra medidas extremas e obriga a moderar propostas.',
      'Congresso de oposição fiscaliza mais (CPIs, convocações, sabatinas mais duras).',
      'Mudanças constitucionais só saem com acordo amplo.',
    ],
    negatives: [
      'Risco alto de paralisia: propostas como o fim da escala 6x1 dificilmente avançam.',
      'O Congresso pode impor a própria pauta e derrubar vetos; o presidente governa reagindo.',
      'Cada votação vira negociação por emendas e cargos, o que encarece a governabilidade, e o risco de crise institucional (inclusive pedidos de impeachment) aumenta.',
    ],
  },
];

/** Quem governava em cada ano (2016 teve dois presidentes). Só rotula o período. */
export const gov = (y: number): string =>
  y <= 2010
    ? 'Lula'
    : y <= 2015
      ? 'Dilma'
      : y === 2016
        ? 'Dilma/Temer'
        : y <= 2018
          ? 'Temer'
          : y <= 2022
            ? 'Bolsonaro'
            : 'Lula';

const series = (start: number, values: number[]) =>
  values.map((value, i) => ({ year: start + i, value, government: gov(start + i) }));

export const INDICATORS: Indicator[] = [
  {
    id: 'ipca',
    title: 'Inflação (IPCA)',
    unit: '% no ano',
    description:
      'Quanto os preços subiram, em média, ao longo de cada ano. É a medida oficial de inflação do país.',
    latest: { label: '12 meses até set/2026', value: '4,58%' },
    howToRead: [
      'Cada barra é um ano. Quanto mais alta, mais os preços subiram naquele ano.',
      'Barra mais baixa que a anterior não quer dizer que as coisas ficaram mais baratas: só que subiram mais devagar.',
      'A faixa verde embaixo mostra quem governava em cada período. Ela só situa o tempo, não aponta culpados.',
    ],
    series: series(
      2003,
      [
        9.3, 7.6, 5.69, 3.14, 4.46, 5.9, 4.31, 5.91, 6.5, 5.84, 5.91, 6.41, 10.67, 6.29, 2.95, 3.75,
        4.31, 4.52, 10.06, 5.79, 4.62, 4.83, 4.26,
      ],
    ),
    cannotConclude: [
      'Uma inflação alta num mandato não prova que o presidente causou toda a alta: 2021 teve o choque global da pandemia; 2015, o reajuste represado de tarifas.',
      'Também não isenta o governo: política de gastos, câmbio e preços administrados influenciam o resultado.',
      'A média esconde diferenças: alimentos e aluguel podem subir bem mais que o índice geral, e é isso que as famílias de menor renda sentem.',
      'Inflação caindo não significa preços caindo — significa preços subindo mais devagar.',
    ],
    sources: [S.sidraIpca],
  },
  {
    id: 'selic',
    title: 'Juros básicos (Selic)',
    unit: '% ao ano, meta do Copom em 31 de dezembro',
    description:
      'A taxa que o Banco Central usa para frear ou estimular a economia. Serve de base para os juros de empréstimos, financiamentos e aplicações.',
    latest: { label: 'decisão do Copom de 16/09/2026', value: '13,75%' },
    howToRead: [
      'Cada barra mostra a taxa básica de juros em vigor no último dia do ano.',
      'Barra alta: crédito mais caro e economia freada para segurar a inflação. Barra baixa: crédito mais barato.',
      'Compare com o gráfico da inflação: os juros costumam subir logo depois que a inflação sobe.',
    ],
    series: series(
      2003,
      [
        16.5, 17.75, 18, 13.25, 11.25, 13.75, 8.75, 10.75, 11, 7.25, 10, 11.75, 14.25, 13.75, 7,
        6.5, 4.5, 2, 9.25, 13.75, 11.75, 12.25, 15,
      ],
    ),
    cannotConclude: [
      'A Selic não é decidida pelo presidente, e sim pelo Copom, do Banco Central. Desde 2021 a diretoria do BC tem mandato fixo e não coincide com o do presidente da República.',
      'Juros sobem para conter a inflação: um ano de Selic alta costuma vir logo depois de inflação alta (compare 2021 e 2022 com o gráfico acima).',
      'As contas do governo também pesam: quando cresce a desconfiança sobre a dívida pública, os juros tendem a ficar mais altos. O gráfico sozinho não mostra quanto disso explica cada ano.',
      'É a taxa básica. O que as famílias pagam no cartão, no cheque especial e no crediário é bem mais alto e não aparece aqui.',
    ],
    sources: [S.sgsSelic, S.bcbSelic, S.lc179],
  },
  {
    id: 'desocupacao',
    title: 'Desemprego',
    unit: '% no trimestre encerrado em dezembro',
    description:
      'Parcela das pessoas que procuram trabalho e não encontram. A série atual do IBGE começa em 2012.',
    latest: { label: 'trimestre até ago/2026', value: '5,3%' },
    howToRead: [
      'Cada barra mostra, de cada 100 pessoas que trabalham ou procuram trabalho, quantas estão sem emprego. Exemplo: 5,1 é cerca de 5 em cada 100.',
      'Aqui, barra mais baixa é melhor.',
      'Os valores são do trimestre que termina em dezembro, para comparar sempre a mesma época do ano.',
    ],
    series: series(
      2012,
      [6.9, 6.2, 6.6, 9.1, 12.1, 11.9, 11.7, 11.1, 14.2, 11.1, 7.9, 7.4, 6.2, 5.1],
    ),
    cannotConclude: [
      'O pico de 2020 reflete a pandemia; a alta de 2015–2016, a recessão daqueles anos. A queda começou em 2021 e continuou depois, atravessando dois governos.',
      'Desemprego baixo não diz nada sobre a qualidade do emprego: informalidade e renda precisam ser vistas junto.',
      'Emprego alto com juros altos (Selic a 13,75%) pode conviver com famílias endividadas e sensação de aperto.',
    ],
    sources: [S.sidraPnad, S.acessaPnad],
  },
  {
    id: 'divida',
    title: 'Dívida pública',
    unit: '% do PIB, em dezembro de cada ano',
    description:
      'Quanto o governo (União, estados e municípios) deve, comparado com tudo o que o país produz em um ano, o PIB. Uma dívida de 80% do PIB quer dizer que ela equivale a quase 10 meses de toda a produção do país.',
    latest: { label: 'ago/2026', value: '82,9%' },
    chart: 'divida',
    howToRead: [
      'A linha mostra o tamanho da dívida comparado com o PIB. Linha subindo quer dizer que a dívida cresceu mais rápido que a economia.',
      'Toque ou passe o mouse num ano para ver, logo abaixo do gráfico, o que fez a dívida subir ou cair naquele ano.',
      '“1 ponto” é 1% do PIB, hoje cerca de R$ 134 bilhões. A dívida de 82,9% do PIB equivale a uns R$ 11 trilhões.',
    ],
    series: series(
      2006,
      [
        55.48, 56.72, 55.98, 59.21, 51.77, 51.27, 53.67, 51.54, 56.28, 65.5, 69.84, 73.72, 75.27,
        74.44, 86.94, 77.31, 71.68, 73.83, 76.27, 78.64,
      ],
    ),
    cannotConclude: [
      'A conta tem dois lados: a dívida em cima e o PIB embaixo. Ela sobe quando o governo gasta mais do que arrecada e com os juros, e cai quando o PIB cresce, inclusive pela inflação, que aumenta o PIB em reais.',
      'O pico de 2020 reflete a pandemia: gastos de emergência e queda do PIB ao mesmo tempo. A queda de 2021 e 2022 veio em boa parte da inflação alta daqueles anos, que inflou o PIB em reais.',
      'Juros altos fazem a dívida crescer sozinha, e a Selic é decidida pelo Banco Central, não pelo presidente (veja o gráfico dos juros, mais acima). Mas o tamanho da dívida também pesa na decisão dos juros: um alimenta o outro.',
      'Não há um número mágico a partir do qual o país quebra. Países ricos devem mais, mas pagam juros bem menores. O FMI usa outro conceito, que inclui títulos na carteira do Banco Central, e chega a um número maior que o do gráfico.',
    ],
    sources: [
      S.sgsDivida,
      S.sgsDividaFatores,
      S.sgsPib,
      S.sgsPibReal,
      S.bcbFatores2013,
      S.bcbFiscais,
      S.sidraIpca,
      S.sgsSelic,
    ],
  },
  {
    id: 'rendimento',
    title: 'Renda do trabalho e salário mínimo',
    unit: 'R$ por mês, em dezembro de cada ano',
    description:
      'Duas linhas: o salário mínimo e o rendimento médio de quem trabalha (somando todos os trabalhos). Em “valores de hoje” a inflação já foi descontada, então dá para comparar os anos direto; em “valores da época” aparece o número que valia naquele ano.',
    highlight: 'a inflação já foi descontada',
    latest: {
      label: 'hoje',
      value:
        'salário mínimo de R$ 1.621 e rendimento médio de R$ 3.777 (trimestre até ago/2026), cerca de 2,3 salários mínimos',
    },
    format: 'reais',
    howToRead: [
      'Cada ponto é o valor de dezembro do ano. Toque ou passe o mouse num ponto para ver o número exato.',
      'Use “Valores de hoje” para comparar anos diferentes: a inflação já foi descontada, então linha subindo quer dizer que dá para comprar mais.',
      '“Valores da época” mostra o número que aparecia no contracheque naquele ano.',
    ],
    series: series(
      2012,
      [3189, 3289, 3348, 3239, 3260, 3306, 3351, 3361, 3442, 3068, 3317, 3418, 3563, 3742],
    ),
    lines: [
      {
        key: 'media',
        label: 'Rendimento médio do trabalho',
        start: 2012,
        real: [3189, 3289, 3348, 3239, 3260, 3306, 3351, 3361, 3442, 3068, 3317, 3418, 3563, 3742],
        nominal: [
          1493, 1630, 1767, 1887, 2032, 2120, 2236, 2319, 2476, 2439, 2795, 3014, 3293, 3613,
        ],
      },
      {
        key: 'minimo',
        label: 'Salário mínimo',
        start: 2003,
        real: [
          822, 827, 903, 1022, 1062, 1095, 1176, 1218, 1222, 1318, 1356, 1361, 1339, 1407, 1455,
          1428, 1432, 1435, 1372, 1429, 1488, 1518, 1565,
        ],
        nominal: [
          240, 260, 300, 350, 380, 415, 465, 510, 545, 622, 678, 724, 788, 880, 937, 954, 998, 1045,
          1100, 1212, 1320, 1412, 1518,
        ],
      },
    ],
    cannotConclude: [
      'Em valores da época, o salário mínimo sempre sobe (de R$ 240 em 2003 para R$ 1.518 em 2025). Descontada a inflação, ele quase dobrou até 2012 e depois cresceu bem mais devagar, com recuo em 2021.',
      'A alta da renda média em 2020 é efeito da pandemia, não ganho de verdade: quem ganhava menos perdeu o emprego e saiu da conta. Em 2021 ela caiu de volta.',
      'É uma média: pode subir porque os salários mais altos subiram, sem que a maioria tenha ganhado mais. Não mostra a renda de quem está desempregado nem de aposentadorias e benefícios.',
      'O salário mínimo foi trazido a valores de hoje pelo IPCA; o IBGE usa um deflator próprio para a renda média. A diferença entre os dois métodos é pequena.',
    ],
    sources: [S.sidraRenda, S.ipeaSalMin, S.sidraIpcaIndice],
  },
];

/**
 * O que fez a dívida bruta mudar de um dezembro para o outro, em pontos do PIB.
 * Cálculo do site com séries do Banco Central: juros e primário vêm das NFSP do governo
 * federal + estados e municípios; o efeito do PIB é a dívida do ano anterior × o
 * crescimento do PIB em reais; "outros" é o que sobra para fechar a conta.
 */
export const DEBT_FACTORS: DebtFactorYear[] = [
  { year: 2007, juros: 5.5, primario: -3.3, pib: -6.3, outros: 5.34 },
  { year: 2008, juros: 5.6, primario: -3.3, pib: -7.1, outros: 4.06 },
  { year: 2009, juros: 5.1, primario: -1.9, pib: -3.7, outros: 3.73 },
  { year: 2010, juros: 5.4, primario: -2.6, pib: -8.4, outros: -1.84 },
  { year: 2011, juros: 5.8, primario: -2.9, pib: -5.8, outros: 2.4 },
  { year: 2012, juros: 5.0, primario: -2.2, pib: -4.7, outros: 4.3 },
  { year: 2013, juros: 5.2, primario: -1.8, pib: -5.2, outros: -0.33 },
  { year: 2014, juros: 5.7, primario: 0.5, pib: -4.0, outros: 2.54 },
  { year: 2015, juros: 8.8, primario: 1.8, pib: -2.0, outros: 0.62 },
  { year: 2016, juros: 6.5, primario: 2.5, pib: -2.9, outros: -1.76 },
  { year: 2017, juros: 6.7, primario: 1.7, pib: -3.4, outros: -1.12 },
  { year: 2018, juros: 6.4, primario: 1.6, pib: -4.4, outros: -2.05 },
  { year: 2019, juros: 5.1, primario: 1.0, pib: -3.9, outros: -3.03 },
  { year: 2020, juros: 4.3, primario: 9.3, pib: -2.2, outros: 1.1 },
  { year: 2021, juros: 4.8, primario: -0.7, pib: -13.5, outros: -0.23 },
  { year: 2022, juros: 5.6, primario: -1.2, pib: -8.2, outros: -1.83 },
  { year: 2023, juros: 5.9, primario: 2.2, pib: -5.7, outros: -0.25 },
  { year: 2024, juros: 6.3, primario: 0.3, pib: -5.2, outros: 1.04 },
  { year: 2025, juros: 7.7, primario: 0.4, pib: -5.7, outros: -0.03 },
];

/** Dado mensal mais recente da dívida, que entra como último ponto da linha. */
export const DEBT_LATEST = { label: 'ago/26', long: 'agosto de 2026', value: 82.87 };

/**
 * Contexto dos anos marcantes, para o painel "O que aconteceu". Só fatos sustentados
 * pelas fontes do gráfico: IPCA, Selic, PIB real (SGS 7326), os fatores acima e o boxe do BC de 2013.
 */
export const DEBT_CONTEXT: Record<number, string> = {
  2007: 'O governo fez superávit e o PIB cresceu 6,1%, mas “outros” empurrou a dívida para cima: o Banco Central comprava dólares para as reservas, e isso entra na dívida bruta. A partir de 2008, os empréstimos do Tesouro a bancos públicos, como o BNDES, também pesaram.',
  2009: 'Crise financeira mundial: o PIB encolheu 0,1%, então quase não diluiu a dívida, e o superávit do governo ficou menor.',
  2010: 'O PIB cresceu 7,5%, o maior avanço da série: o crescimento diluiu mais do que os juros somaram, e a dívida caiu mais de 7 pontos.',
  2015: 'Recessão: o PIB encolheu 3,5%, a Selic subiu para 14,25% e o governo passou a gastar mais do que arrecadava. Os juros sozinhos somaram quase 9 pontos.',
  2016: 'O PIB encolheu de novo (−3,3%) e o déficit aumentou. A Selic seguiu alta, em 13,75%.',
  2020: 'Pandemia: os gastos de emergência levaram ao maior déficit da série, e o PIB encolheu 3,3%. Foi o maior salto da dívida desde 2006.',
  2021: 'Inflação de 10% e PIB crescendo 4,8% fizeram o PIB em reais aumentar muito. Isso diluiu a dívida mais do que em qualquer outro ano da série.',
  2022: 'Inflação ainda alta e superávit do governo: a dívida seguiu caindo, mesmo com a Selic subindo para 13,75%.',
  2025: 'Com a Selic a 15% no fim do ano, os juros foram o maior peso, o maior desde 2015.',
};

/**
 * O que cada um já conseguiu aprovar, por cargo. Mesmo número de exemplos para os
 * dois; os números de cada cargo dizem o recorte (período e o que foi contado).
 */
export const LAW_RECORDS: LawRecord[] = [
  {
    id: 'lula',
    summary:
      'Foi deputado federal por um mandato, o da Constituinte, e é presidente pela terceira vez. Como presidente, ele não aprova lei: manda projetos e medidas provisórias, e o Congresso decide.',
    roles: [
      {
        role: 'Deputado federal por SP',
        period: '1987–1991',
        kind: 'parlamentar',
        stats: [
          { value: '41', label: 'emendas apresentadas na Assembleia Constituinte' },
          { value: '7', label: 'emendas aprovadas, em diferentes etapas' },
          {
            value: '0 de 6',
            label:
              'projetos de lei de 1988 e 1989 (FGTS, Previdência, perdas salariais e mutuários) viraram lei',
          },
        ],
        examples: [
          {
            title: 'Juizados especiais obrigatórios',
            detail: 'Emenda incorporada ao art. 98 da Constituição, aprovada com 78 votos.',
            how: 'Emenda dele',
          },
          {
            title: 'Salário que não pode ser reduzido',
            detail:
              'Emenda sobre a irredutibilidade do salário, incorporada ao art. 7º, aprovada com 66 votos.',
            how: 'Emenda dele',
          },
        ],
        note: 'A emenda da jornada de 40 horas foi rejeitada por 217 a 165. A Constituição saiu com 44 horas semanais.',
        sources: [S.cfLulaFlavioCongresso, S.camaraLulaDeputado],
      },
      {
        role: 'Presidente, 1º e 2º mandatos',
        period: '2003–2010',
        kind: 'executivo',
        stats: [
          { value: '32', label: 'projetos de lei do governo viraram norma em 2003 e 2004' },
          {
            value: '90,8%',
            label: 'das medidas provisórias aprovadas pelo Congresso nos três primeiros anos',
          },
        ],
        examples: [
          {
            title: 'Bolsa Família (Lei 10.836/2004)',
            detail: 'Criado pela Medida Provisória 132/2003, que o Congresso transformou em lei.',
            how: 'Enviado pelo governo',
          },
          {
            title: 'Lei Maria da Penha (Lei 11.340/2006)',
            detail: 'Contra a violência doméstica; nasceu do PL 4.559/2004, enviado pelo governo.',
            how: 'Enviado pelo governo',
          },
        ],
        sources: [
          S.aosFatosPlsExecutivo,
          S.poder360Mps,
          S.camaraBolsaFamilia,
          S.camaraMariaDaPenha,
        ],
      },
      {
        role: 'Presidente, 3º mandato',
        period: '2023–hoje',
        kind: 'executivo',
        stats: [
          { value: '22 de 59', label: 'projetos de lei do governo viraram norma em 2023 e 2024' },
          {
            value: '37 de 179',
            label: 'medidas provisórias viraram lei até dez/2025 (21%); 102 perderam a validade',
          },
        ],
        examples: [
          {
            title: 'Arcabouço fiscal (Lei Complementar 200/2023)',
            detail: 'Regra que limita o crescimento dos gastos do governo; nasceu do PLP 93/2023.',
            how: 'Enviado pelo governo',
          },
          {
            title: 'IR zerado até R$ 5 mil (Lei 15.270/2025)',
            detail:
              'Isenção para quem ganha até R$ 5 mil por mês e imposto mínimo para altas rendas; nasceu do PL 1.087/2025.',
            how: 'Enviado pelo governo',
          },
        ],
        note: 'A taxa de medidas provisórias aprovadas é a menor desde 2003: o Congresso deixou a maioria perder a validade sem votar.',
        sources: [S.aosFatosPlsExecutivo, S.poder360Mps, S.camaraArcabouco, S.camaraIr5mil],
      },
    ],
  },
  {
    id: 'flavio',
    summary:
      'Foi deputado estadual no Rio por quatro mandatos e é senador desde 2019. Nunca ocupou cargo no Executivo, então o histórico dele é só de parlamentar.',
    roles: [
      {
        role: 'Deputado estadual no RJ (Alerj)',
        period: '2003–2019',
        kind: 'parlamentar',
        stats: [
          { value: '208', label: 'propostas apresentadas na Assembleia do Rio' },
          { value: '51', label: 'viraram lei estadual, cerca de 1 em cada 4' },
        ],
        examples: [
          {
            title: 'Renovação da carteira de motorista',
            detail: 'Isenção de taxas estaduais para agentes de segurança renovarem a habilitação.',
            how: 'Autor',
          },
          {
            title: 'Multa para trote',
            detail: 'Multa para quem passa trote aos serviços de emergência.',
            how: 'Autor',
          },
          {
            title: 'Reprovação no exame psicológico',
            detail:
              'Candidato de concurso passa a ter direito de saber por que foi reprovado no psicotécnico.',
            how: 'Autor',
          },
        ],
        note: 'Não avançaram, entre outras, uma PEC estadual sobre expulsão de militares do estado e o referendo sobre cotas raciais, proposto três vezes.',
        sources: [S.folhaFlavioLeis],
      },
      {
        role: 'Senador pelo RJ',
        period: '2019–hoje',
        kind: 'parlamentar',
        stats: [
          {
            value: '66',
            label: 'propostas como primeiro autor (53 projetos de lei, 4 PECs e 9 de outros tipos)',
          },
          {
            value: '0',
            label: 'viraram lei até out/2026; 2 passaram no Senado e esperam a Câmara',
          },
          { value: '106', label: 'propostas em que assina como coautor, 91 delas PECs' },
        ],
        examples: [
          {
            title: 'IPVA zero para carro com 20 anos ou mais (Emenda Constitucional 137/2025)',
            detail: 'Veio da PEC 72/2023, do senador Cleitinho, que ele assinou junto.',
            how: 'Coautor',
          },
          {
            title: 'Microcrédito (Lei 15.364/2026)',
            detail:
              'Amplia o crédito para pequenos empreendedores; veio do PL 3.190/2023, do senador Esperidião Amin, e foi sancionado com vetos.',
            how: 'Coautor',
          },
          {
            title: 'Fim da saidinha de presos (Lei 14.843/2024)',
            detail:
              'Foi o relator no Senado. O presidente vetou parte da lei e o Congresso derrubou o veto.',
            how: 'Relator',
          },
        ],
        note: 'As contagens de autoria mudam conforme o levantamento (a assessoria dele fala em 62 como autor principal), porque cada um conta tipos diferentes de proposta. Os números acima são a contagem do site nos dados abertos do Senado.',
        sources: [
          S.senadoAutoriasFlavio,
          S.senadoPerfilFlavio,
          S.senadoPec72,
          S.senadoPl3190,
          S.camaraSaidinha,
          S.folhaFlavioLeis,
          S.cfLulaFlavioCongresso,
        ],
      },
    ],
  },
];

/**
 * O que quer dizer cada papel que aparece nas leis (autor, coautor...), em linguagem
 * simples. Todo `how` usado em LAW_RECORDS precisa estar aqui.
 */
export const LAW_ROLES: { label: string; text: string }[] = [
  {
    label: 'Autor',
    text: 'Quem escreveu e apresentou o projeto. A ideia nasceu no gabinete dele.',
  },
  {
    label: 'Coautor',
    text: 'Assinou o projeto junto com o autor principal: apoiou a ideia desde o começo, mas não foi quem a escreveu. Uma PEC precisa da assinatura de pelo menos 1/3 dos senadores ou deputados, por isso costuma ter dezenas de coautores.',
  },
  {
    label: 'Relator',
    text: 'O parlamentar escolhido para analisar o projeto de outra pessoa. Ele estuda o texto, recomenda aprovar ou rejeitar e pode reescrever partes antes da votação.',
  },
  {
    label: 'Enviado pelo governo',
    text: 'O presidente e os ministérios escrevem a proposta e mandam ao Congresso, que pode mudar o texto e precisa aprovar. Inclui a medida provisória, que vale na hora, mas perde a validade se o Congresso não votar em até 120 dias.',
  },
  {
    label: 'Emenda dele',
    text: 'Proposta de mudança num texto que já estava em discussão. Aqui, sugestões de Lula para o texto da Constituição de 1988.',
  },
];

/** Cuidados para comparar os dois históricos sem tirar conclusão errada. */
export const LAW_READING = [
  'Ninguém aprova lei sozinho. O presidente envia o projeto e o Congresso muda e vota; o parlamentar precisa convencer a maioria. “Aprovou” quer dizer “conseguiu juntar votos”.',
  'Presidente tem mais ferramentas: só ele edita medida provisória, que vale na hora, e o governo controla verbas e cargos que ajudam a formar maioria. Comparar o número de leis de um presidente com o de um senador é comparar coisas diferentes.',
  'Projeto de parlamentar costuma parar nas comissões. Dos 66 do Flávio no Senado, 36 ainda esperam a escolha de um relator. Isso é comum no Congresso, não exclusividade dele.',
  'Quantidade não mede importância: uma lei que cria data comemorativa conta igual a uma reforma. Por isso aparecem exemplos, além dos números.',
  'Relatar também é legislar: o relator reescreve o texto e negocia os votos, mesmo sem ser o autor.',
];

export const SNAPSHOT = {
  items: [
    {
      label: 'Inflação em 12 meses',
      value: '4,58%',
      detail: 'IPCA até set/2026 · acima do teto da meta (4,5%)',
      sources: [S.sidraIpca],
    },
    {
      label: 'Juros básicos (Selic)',
      value: '13,75%',
      detail: 'ao ano · decisão do Copom de 16/09/2026',
      sources: [S.selic, S.bcbSelic],
    },
    {
      label: 'Desemprego',
      value: '5,3%',
      detail: 'trimestre até ago/2026',
      sources: [S.sidraPnad, S.acessaPnad],
    },
    {
      label: 'Rendimento médio real',
      value: 'R$ 3.777',
      detail: 'por mês · trimestre até ago/2026',
      sources: [S.sidraRenda, S.acessaPnad],
    },
  ],
  reading:
    'Os números ajudam a entender a sensação de aperto: o emprego está alto, mas os juros de 13,75% ao ano encarecem cartão, financiamento e aluguel, e a inflação acumulada dos últimos anos não foi devolvida — os preços não voltaram, só passaram a subir mais devagar.',
};

export const EDITORIAL_RULES = [
  'Nenhuma nota para candidatos. O site não declara vencedor.',
  'Mesma estrutura, mesmas perguntas e mesmo tratamento visual para os dois.',
  'Proposta, fato e análise aparecem com etiquetas diferentes. Proposta não é realização.',
  'Toda informação tem link para a fonte e data de acesso.',
  '“O que o plano não diz” aponta temas importantes que o plano registrado no TSE não trata, ou trata sem detalhes.',
  'Benefícios e riscos são análises do site, não fatos. Discorde à vontade, e confira as fontes.',
];

/**
 * Autoria e repositório, mostrados no rodapé. `repoUrl` vazio esconde os links do
 * GitHub; preencha quando o repositório público existir.
 */
export const SITE = {
  author: 'Simone Auler',
  repoUrl: 'https://github.com/SyAuler/politica-sem-gritos',
  license: 'MIT',
};

/** Limites desta versão do site: o que ele não cobre ou cobre com ressalva. */
export const LIMITATIONS = [
  'As propostas foram resumidas dos planos de governo registrados no TSE, com a página de cada item. Resumir sempre simplifica: na dúvida, leia o trecho no PDF oficial.',
  'Só entra o que está no plano registrado. Promessas feitas em debates, entrevistas e redes sociais não aparecem aqui.',
  'Os processos foram conferidos em reportagens e agências de notícias, com o link de cada decisão: os sistemas do STF, do STJ e do TJ-RJ não puderam ser consultados diretamente. Os casos de 2026 ainda estão em andamento e podem mudar.',
  'O histórico de leis do Flávio no Senado foi contado pelo site nos dados abertos do Senado (out/2026). Os números da Alerj, da Constituinte e dos governos Lula vêm de levantamentos da imprensa, com o link de cada um.',
  'A trajetória dos candidatos vem de biografias públicas (Wikipédia) e ainda não foi conferida, item por item, em fonte oficial.',
  'Os 27 senadores que continuam no mandato vêm de levantamentos da imprensa; os eleitos em 2026 foram conferidos no TSE.',
];

/** Fatos que podem mudar o conteúdo depois desta revisão (o site não promete atualizar). */
export const UPDATES: { when: string; text: string }[] = [
  {
    when: '25 de outubro',
    text: 'Resultado do 2º turno. A partir daí só um dos cenários do Congresso continua valendo.',
  },
  {
    when: 'Até dezembro',
    text: 'Diplomação dos eleitos: as 8 vagas indefinidas da Câmara podem ser definidas, e a Justiça Eleitoral pode mudar algum resultado.',
  },
  {
    when: '1º de janeiro de 2027',
    text: 'Posse. Partidos podem trocar de lado no Congresso, e a base do governo deixa de ser só a do papel.',
  },
  {
    when: 'A cada divulgação',
    text: 'IBGE e Banco Central publicam novos dados de inflação, juros, dívida pública, desemprego e renda.',
  },
];

/**
 * Perguntas sugeridas para levar a uma IA. `{tema}` vira o nome do tema escolhido.
 * Todas pedem fontes, separação entre fato e opinião e nenhuma recomendação de voto.
 */
export const AI_QUESTIONS: { id: string; label: string; text: string }[] = [
  {
    id: 'tema',
    label: 'Comparar as propostas do tema',
    text: 'Compare as propostas de Lula e de Flávio Bolsonaro sobre {tema}, com base nos planos de governo registrados no TSE para a eleição presidencial de 2026. Para cada proposta, explique em linguagem simples o que pode mudar na vida das pessoas, com prós e contras. Separe o que é fato do que é opinião, cite as fontes e não recomende voto. Se você não tiver acesso a esses documentos, diga isso em vez de supor.',
  },
  {
    id: 'estudos',
    label: 'O que dizem especialistas',
    text: 'O que estudos e especialistas dizem sobre {tema} no Brasil? Mostre argumentos a favor e contra as principais propostas em debate na eleição presidencial de 2026, com fontes, de forma imparcial e sem recomendar voto.',
  },
  {
    id: 'diferencas',
    label: 'Diferenças entre os planos',
    text: 'Quais são as principais diferenças entre os planos de governo de Lula e de Flávio Bolsonaro registrados no TSE para a eleição presidencial de 2026? Organize por tema, separe o que é fato do que é opinião, cite as fontes e não recomende voto. Se você não tiver acesso a esses documentos, diga isso em vez de supor.',
  },
  {
    id: 'congresso',
    label: 'Presidente e Congresso',
    text: 'O que um presidente do Brasil consegue fazer sozinho e o que depende do Congresso? Explique com exemplos simples, como medidas provisórias, vetos, leis e emendas à Constituição.',
  },
  {
    id: 'checar',
    label: 'Checar um vídeo ou notícia',
    text: 'Como posso verificar se um vídeo, áudio ou notícia sobre um candidato é verdadeiro antes de compartilhar? Me dê um passo a passo simples e ferramentas gratuitas de checagem usadas no Brasil.',
  },
];

/**
 * IAs com versão gratuita, em ordem alfabética e com o mesmo tratamento. `prefill`:
 * o link já abre com a pergunta digitada; nas outras, a pergunta vai copiada.
 */
export const AI_LINKS: { name: string; url: string; prefill: boolean }[] = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/?q=', prefill: true },
  { name: 'Claude', url: 'https://claude.ai/new?q=', prefill: true },
  { name: 'Copilot', url: 'https://copilot.microsoft.com/', prefill: false },
  { name: 'Gemini', url: 'https://gemini.google.com/app', prefill: false },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=', prefill: true },
];
