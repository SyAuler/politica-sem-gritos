// "Para onde vão os impostos": textos, fontes e notas. Os números vêm de impostos-dados.ts,
// gerado por scripts/orcamento/gera_dados_site.py a partir dos dados oficiais.
import { SourceReference } from './models';
import { HISTORICO_AT, src } from './fontes';

const f = (title: string, publisher: string, url: string) =>
  src(title, publisher, url, HISTORICO_AT);

export const TAX_SOURCES = {
  rfb: f(
    'Arrecadação das receitas federais, série histórica 1994–2025',
    'Receita Federal',
    'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/dados-abertos/receitadata/arrecadacao/serie-historica',
  ),
  siop: f(
    'Orçamento federal executado por função, órgão e unidade (endpoint SPARQL)',
    'Ministério do Planejamento e Orçamento / SIOP',
    'https://orcamento.dados.gov.br/sparql/',
  ),
  rreo: f(
    'Relatório Resumido da Execução Orçamentária da União (usado para conferir os totais)',
    'Tesouro Nacional / Siconfi',
    'https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo?an_exercicio=2025&nr_periodo=6&co_tipo_demonstrativo=RREO&no_anexo=RREO-Anexo%2002&co_esfera=U&id_ente=1',
  ),
  ipca: f(
    'Tabela 1737 — IPCA, número-índice mensal (correção para reais de 2025)',
    'IBGE / SIDRA',
    'https://sidra.ibge.gov.br/tabela/1737',
  ),
  populacao: f(
    'Tabela 6579 — População residente estimada',
    'IBGE / SIDRA',
    'https://sidra.ibge.gov.br/tabela/6579',
  ),
  cnj: f(
    'Justiça em Números 2026 (ano-base 2025)',
    'Conselho Nacional de Justiça',
    'https://www.cnj.jus.br/wp-content/uploads/2026/06/relatorio-justica-em-numeros2026-1.pdf',
  ),
  repo: f(
    'Scripts que baixam os dados e refazem as contas',
    'Política sem Gritos (GitHub)',
    'https://github.com/SyAuler/politica-sem-gritos/tree/main/scripts/orcamento',
  ),
};

/** Os dois números de abertura. */
export const TAX_HEADLINES = [
  {
    label: 'Arrecadado pelo governo federal em 2025',
    value: 'R$ 2,89 trilhões',
    detail:
      'Impostos e contribuições federais, antes dos repasses obrigatórios a estados e municípios. Em valores corrigidos pela inflação, é 2,4 vezes o que se arrecadava em 2003.',
    sources: [TAX_SOURCES.rfb, TAX_SOURCES.ipca],
  },
  {
    label: 'Gasto pelo governo federal em 2025',
    value: 'R$ 3,72 trilhões',
    detail:
      'Despesa executada, sem contar a rolagem da dívida (troca de títulos que vencem por títulos novos). O gasto é maior que a arrecadação porque também é pago com outras receitas e com dívida nova.',
    sources: [TAX_SOURCES.siop, TAX_SOURCES.rreo],
  },
];

/** Cor de cada grupo da grade "de cada R$ 100" (paleta validada para daltonismo). */
export const PER100_COLORS: Record<string, string> = {
  previdencia: '#2a78d6',
  transferencias: '#eb6834',
  divida: '#1baf7a',
  encargos: '#eda100',
  assistencia: '#e87ba4',
  saude: '#008300',
  educacao: '#6250d6',
  demais: '#b6bdc4',
};

/** Rótulos curtos dos grupos, para a legenda do gráfico entrada x saída. */
export const PER100_SHORT: Record<string, string> = {
  previdencia: 'Previdência',
  transferencias: 'Repasses a estados e municípios',
  divida: 'Dívida',
  encargos: 'Outros encargos',
  assistencia: 'Assistência social',
  saude: 'Saúde',
  educacao: 'Educação',
  demais: 'Demais áreas',
};

/** O que cada grupo inclui, em uma frase. */
export const PER100_NOTES: Record<string, string> = {
  previdencia: 'Aposentadorias e pensões do INSS e dos servidores federais.',
  transferencias:
    'Parte dos impostos que a Constituição manda repassar (fundos de participação, Fundeb).',
  divida: 'Juros pagos e a parte do principal paga com recursos próprios. Não inclui a rolagem.',
  encargos:
    'Precatórios (dívidas da União reconhecidas pela Justiça), pensões militares e cobertura do resultado do Banco Central.',
  assistencia: 'Bolsa Família e Benefício de Prestação Continuada (BPC), entre outros.',
  saude:
    'Gasto federal com o SUS. Estados e municípios também gastam com saúde, e isso não entra aqui.',
  educacao: 'Universidades e institutos federais, apoio à educação básica, entre outros.',
  demais:
    'Trabalho (seguro-desemprego), defesa, Justiça, Congresso, segurança pública, agricultura, ciência e as demais áreas.',
};

/** O que cada card inclui, quando não é óbvio (aparece no próprio card). */
export const ORG_SCOPE: Record<string, string> = {
  judiciario_uniao:
    'Inclui STF, tribunais superiores, Justiça Federal, do Trabalho, Eleitoral e Militar e o tribunal do DF. A Justiça dos estados fica fora: está no Judiciário do país inteiro, abaixo.',
  stf: 'Também está somado no Judiciário federal.',
};

/** Notas por instituição, abertas no painel de detalhes. */
export const ORG_NOTES: Record<string, { text: string; sources: SourceReference[] }[]> = {
  camara: [
    {
      text: 'Por deputado, em 2025: salário de R$ 46.366,19 por mês, verba de gabinete de até R$ 133.170,54 por mês para contratar assessores e cota parlamentar que custou, em média, R$ 466 mil no ano. Os três somam cerca de R$ 2,6 milhões por deputado por ano; o resto do orçamento paga servidores, aposentados, prédios e serviços da Casa.',
      sources: [
        f(
          'Cota para o Exercício da Atividade Parlamentar — dados abertos (arquivos anuais)',
          'Câmara dos Deputados',
          'https://www.camara.leg.br/cotas/Ano-2025.csv.zip',
        ),
      ],
    },
  ],
  senado: [
    {
      text: 'Por senador, em 2025, a cota parlamentar custou em média R$ 461 mil. O salário é o mesmo dos deputados. O valor da verba de gabinete do senador não foi localizado.',
      sources: [
        f(
          'Dados abertos da cota parlamentar (CEAPS), arquivo de 2025',
          'Senado Federal',
          'https://www.senado.gov.br/transparencia/LAI/verba/despesa_ceaps_2025.csv',
        ),
      ],
    },
  ],
  stf: [
    {
      text: 'O valor por ministro é o orçamento do tribunal inteiro dividido por 11: inclui servidores, aposentados, segurança, prédios e sistemas. Não é o que cada ministro recebe ou controla. O salário de ministro do STF (R$ 46.366,19) é o teto do funcionalismo.',
      sources: [TAX_SOURCES.siop],
    },
  ],
  judiciario_uniao: [
    {
      text: 'Inclui o Superior Tribunal de Justiça, a Justiça Federal, a do Trabalho, a Eleitoral, a Militar, o Tribunal de Justiça do DF e o CNJ. O fundo partidário, que passa pelo orçamento da Justiça Eleitoral, foi retirado da conta.',
      sources: [TAX_SOURCES.siop],
    },
  ],
  mpu: [
    {
      text: 'Ministério Público Federal, do Trabalho, Militar e do DF. Os Ministérios Públicos estaduais são pagos pelos estados e não entram aqui.',
      sources: [TAX_SOURCES.siop],
    },
  ],
  tcu: [
    {
      text: 'O TCU fiscaliza o uso do dinheiro federal e é um órgão de apoio do Congresso.',
      sources: [TAX_SOURCES.siop],
    },
  ],
  presidencia: [
    {
      text: 'O salto de 2025 tem duas causas principais no orçamento: a organização da COP 30, a conferência do clima da ONU em Belém (R$ 769 milhões pagos), e a comunicação institucional, que passou de R$ 204 milhões em 2024 para R$ 442 milhões. A unidade da Presidência não inclui ministérios nem a Vice-Presidência.',
      sources: [TAX_SOURCES.siop],
    },
  ],
};

const TESOURO_JUSTICA = f(
  'Justiça brasileira é a 2ª mais cara do mundo, aponta estudo do Tesouro (dados de 2022, 50 países)',
  'Gazeta do Povo',
  'https://www.gazetadopovo.com.br/economia/justica-brasileira-segunda-mais-cara-mundo-tesouro/',
);

/**
 * O Judiciário do país inteiro: tribunais federais e estaduais (relatório do CNJ) mais o STF, que
 * não é fiscalizado pelo CNJ e por isso fica fora do total do relatório.
 */
export const JUDICIARY = {
  total: 'R$ 165,6 bi',
  perCapita: 'R$ 776',
  lead: 'Custo de todo o Poder Judiciário em 2025, somando os tribunais dos estados e os federais. É 2,73% de todo o gasto público do país (União, estados e municípios) e 1,3% do PIB. Desses R$ 165,6 bi, R$ 62,6 bi são pagos pela União (o Judiciário federal, R$ 293 por habitante, no card acima) e cerca de R$ 103 bi pelos estados.',
  /** Por ramo, em R$ bilhões de 2025. */
  branches: [
    { label: 'Justiça dos estados', value: 106.1, note: 'paga pelos governos estaduais' },
    { label: 'Justiça do Trabalho', value: 27.7 },
    { label: 'Justiça Federal', value: 16.9 },
    { label: 'Justiça Eleitoral', value: 8.3 },
    { label: 'Tribunais superiores (sem o STF)', value: 5.3 },
    { label: 'Supremo Tribunal Federal', value: 0.9, note: 'fora do relatório do CNJ' },
    { label: 'Justiça Militar estadual', value: 0.3 },
  ],
  facts: [
    { value: '90%', label: 'vai para pessoal (R$ 148,5 bi), incluindo aposentados' },
    { value: '15%', label: 'paga aposentadorias e pensões de juízes e servidores' },
    {
      value: '459 mil',
      label:
        'pessoas trabalham no Judiciário: 19 mil juízes, 281 mil servidores, terceirizados e estagiários',
    },
    { value: '75,5 mi', label: 'processos em andamento no fim de 2025' },
  ],
  perMagistrate:
    'Na Justiça dos estados, as despesas com juízes chegam a R$ 117,9 mil por mês por magistrado, em média (alta de 22,4% em 2025); na Justiça Federal, R$ 85,9 mil. O CNJ avisa que esse valor não é salário: inclui encargos, indenizações, imposto de renda e viagens.',
  /**
   * Evolução ano a ano, em reais de 2025 (série corrigida pelo próprio CNJ, sem o STF):
   * total em R$ bilhões e por habitante em R$.
   */
  series: [
    { year: 2013, total: 119.5, perCapita: 594.52 },
    { year: 2014, total: 124.6, perCapita: 614.27 },
    { year: 2015, total: 130.6, perCapita: 638.61 },
    { year: 2016, total: 131.3, perCapita: 637.06 },
    { year: 2017, total: 136.5, perCapita: 657.34 },
    { year: 2018, total: 135.8, perCapita: 651.48 },
    { year: 2019, total: 139.4, perCapita: 666.8 },
    { year: 2020, total: 133.1, perCapita: 628.38 },
    { year: 2021, total: 125.5, perCapita: 588.19 },
    { year: 2022, total: 132.8, perCapita: 639.04 },
    { year: 2023, total: 144.8, perCapita: 713.14 },
    { year: 2024, total: 152.8, perCapita: 718.62 },
    { year: 2025, total: 164.6, perCapita: 771.48 },
  ],
  seriesNote: {
    perCapita:
      'Por habitante, o custo passou de R$ 595 em 2013 para R$ 771 em 2025: alta de 30% acima da inflação. No mesmo período, a população cresceu cerca de 6%.',
    total:
      'No total, passou de R$ 119,5 bilhões em 2013 para R$ 164,6 bilhões em 2025: alta de 38% acima da inflação. A queda de 2020 e 2021 coincide com a pandemia.',
  },
  international:
    'Em 2022, o Brasil gastou 1,33% do PIB com tribunais, o 2º maior gasto entre 50 países comparados pelo Tesouro Nacional; a média do grupo foi de cerca de 0,3%.',
  counterpoint:
    'Por outro lado, o Brasil tem 8,9 juízes para cada 100 mil habitantes, menos da metade da média europeia (21,9), segundo o CNJ. Ou seja, o número de juízes, sozinho, não explica o tamanho do gasto.',
  why: 'O STF fica fora do total do relatório porque, diferentemente das outras cortes, não é fiscalizado pelo CNJ. Aqui ele foi somado com o valor pago no orçamento federal.',
  sources: [TAX_SOURCES.cnj, TAX_SOURCES.siop, TESOURO_JUSTICA],
};

/**
 * Análise: onde o gasto público se concentra. Só fatos que já estão na seção, reunidos, com
 * contrapontos, para quem quer entender o peso de cada parte sem tirar conclusão apressada.
 */
export const TAX_CONCENTRATION = [
  {
    title: 'Previdência',
    text: 'É a maior despesa: R$ 30 de cada R$ 100 gastos pelo governo federal em 2025, ou R$ 1,1 trilhão. Em valores corrigidos, é 2,3 vezes o que se gastava em 2003.',
    counter:
      'Esse dinheiro paga as aposentadorias e pensões de quem contribuiu. O peso cresce com o envelhecimento da população e com as regras de cada época.',
  },
  {
    title: 'Dívida pública',
    text: 'R$ 16 de cada R$ 100 vão para juros e para pagar parte do principal da dívida, sem contar a rolagem.',
    counter:
      'Os juros dependem da taxa Selic e do tamanho da dívida acumulada por vários governos; não são uma escolha de um único ano.',
  },
  {
    title: 'Judiciário',
    text: 'R$ 165,6 bilhões em 2025, somando estados e União: 1,3% do PIB, contra uma média de cerca de 0,3% em outros países (Tesouro, dados de 2022). 90% vai para pessoal, e os tribunais estaduais pagaram ao menos R$ 10,7 bilhões acima do teto (estimativa de ONGs).',
    counter:
      'O Brasil tem menos juízes por habitante que a Europa e um volume muito grande de processos (75,5 milhões em andamento).',
  },
  {
    title: 'Pessoal e aposentados nas instituições federais',
    text: 'Na Câmara, no Senado, no TCU e no Judiciário da União, mais de 80% do orçamento vai para pessoal. No Senado, 44% paga aposentados e pensionistas; na Câmara, 32%; no TCU, 34%.',
    counter:
      'Parte desse custo vem de regras antigas: quem entrou no serviço público até 2003 ainda pode se aposentar com o último salário e os mesmos reajustes de quem está na ativa, se cumprir as regras de transição das reformas de 2003 e 2019.',
    sources: [
      f(
        'Emenda Constitucional 103/2019 (reforma da Previdência), arts. 4º e 20: regras de transição dos servidores',
        'Planalto',
        'https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm',
      ),
    ],
  },
];

/** Fundos que financiam partidos e campanhas. */
export const PARTY_FUNDS = {
  detail:
    'O fundo partidário é pago todo ano aos partidos; o fundo eleitoral só existe em ano de eleição e paga as campanhas. Em 2026, o fundo eleitoral é de R$ 4,96 bilhões; em 2025, o fundo partidário pagou R$ 1,31 bilhão.',
  rows: [
    { year: '2018', eleitoral: 1716.2, partidario: 860.4 },
    { year: '2020', eleitoral: 2035.0, partidario: 943.1 },
    { year: '2022', eleitoral: 4961.5, partidario: 1107.1 },
    { year: '2024', eleitoral: 4954.7, partidario: 1243.7 },
    { year: '2026', eleitoral: 4961.5, partidario: 1434.8 },
  ],
  note: 'Valores da época, sem correção pela inflação; 2026 é o valor aprovado no Orçamento.',
  sources: [
    TAX_SOURCES.siop,
    f(
      'Fundo Especial de Financiamento de Campanha (FEFC) 2026',
      'Tribunal Superior Eleitoral',
      'https://www.tse.jus.br/eleicoes/eleicoes-2026-content/prestacao-de-contas/fundo-especial-de-financiamento-de-campanha-fefc',
    ),
  ],
};

/** Pagamentos acima do teto do funcionalismo: decisões oficiais e estimativas não oficiais. */
export const SUPERSALARIES = {
  official: [
    {
      text: 'Em março de 2026, o STF limitou os adicionais de juízes e promotores a 70% do teto (35% por tempo de carreira e 35% de verbas indenizatórias) e suspendeu valores reconhecidos antes de fevereiro de 2026 até auditoria. Na sessão, a economia estimada foi de R$ 7,3 bilhões por ano.',
      sources: [
        f(
          'STF limita penduricalhos: como ficam os salários de juízes e do MP após decisão da Corte',
          'BBC Brasil (via O Povo)',
          'https://www.opovo.com.br/agencia/bbc/2026/04/01/stf-limita-penduricalhos-como-ficam-os-salarios-de-juizes-e-do-mp-apos-decisao-da-corte.html',
        ),
      ],
    },
  ],
  estimates: [
    {
      text: 'Tribunais estaduais e do DF pagaram ao menos R$ 10,7 bilhões acima do teto a magistrados em 2025, contra R$ 4,5 bilhões em 2023. 98% dos magistrados com dados completos receberam acima do teto. Estimativa da Transparência Brasil e da República.org com base nos contracheques publicados pelos tribunais; não há total oficial.',
      sources: [
        f(
          'Justiça estadual pagou R$ 10,7 bi acima do teto a magistrados em 2025',
          'Poder360',
          'https://www.poder360.com.br/poder-justica/justica-estadual-pagou-r-107-bi-acima-do-teto-a-magistrados-em-2025/',
        ),
        f(
          'Tribunais pagaram R$ 10 bilhões extrateto em 2025 (estudo completo)',
          'Transparência Brasil e República.org',
          'https://static.poder360.com.br/2026/03/tjs_pagaram_10_bilhoes_extrateto_2025.pdf',
        ),
      ],
    },
  ],
};

/** Cuidados para ler esta parte. */
export const TAX_READING = [
  'A seção “Onde o dinheiro se concentra” junta os maiores pesos para ajudar a entender o orçamento. Concentração não é sinônimo de desperdício: cada item tem razões e efeitos que os números sozinhos não mostram.',
  'Aqui estão só os impostos federais. Estados e municípios arrecadam e gastam por conta própria (ICMS, ISS, IPTU), e isso não entra.',
  'A rolagem da dívida (R$ 1,4 trilhão em 2025) fica de fora porque é troca de títulos velhos por novos, não gasto pago com impostos. Somada, ela faria a dívida parecer a maior despesa do país.',
  'Os juros do orçamento são os pagos em dinheiro no ano. O Banco Central publica outro número de juros, maior, que inclui os juros que se acumulam sem pagamento. Os dois não são a mesma coisa.',
  'Valores de anos diferentes foram corrigidos pela inflação (IPCA) para reais de 2025, senão a comparação engana. 2020 foge do padrão por causa do auxílio emergencial da pandemia.',
  'Os governos aparecem só como legenda de período: o gráfico não atribui mérito nem culpa.',
  'Todas as contas podem ser refeitas com os scripts publicados no repositório do site.',
];
