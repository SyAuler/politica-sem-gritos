// Quanto cada candidato custa aos cofres públicos no mandato atual. Não é comparação entre
// os dois: presidente e senador têm estruturas e níveis diferentes. Cada coluna mostra só os
// custos daquele candidato e, quando existe, a média do próprio cargo como referência.
import { CandidateId, SourceReference } from './models';
import { HISTORICO_AT, src } from './fontes';

const f = (title: string, publisher: string, url: string) =>
  src(title, publisher, url, HISTORICO_AT);

const TSE_CONTAS = f(
  'Prestação de contas eleitorais dos candidatos 2026 (receitas e despesas, arquivo gerado em 21/10/2026)',
  'Tribunal Superior Eleitoral',
  'https://cdn.tse.jus.br/estatistica/sead/odsele/prestacao_contas/prestacao_de_contas_eleitorais_candidatos_2026.zip',
);
const DECRETO_SUBSIDIO = f(
  'Decreto Legislativo 172/2022 — subsídios de presidente, vice, ministros e parlamentares',
  'Câmara dos Deputados',
  'https://www2.camara.leg.br/legin/fed/decleg/2022/decretolegislativo-172-21-dezembro-2022-793529-republicacao-166629-pl.html',
);
const CPGF = f(
  'Download de dados — Cartão de Pagamento do Governo Federal (arquivos mensais de 2013 a 2026)',
  'Portal da Transparência / CGU',
  'https://portaldatransparencia.gov.br/download-de-dados/cpgf',
);
const TCU_SIGILO = f(
  'TCU mostra 99% de sigilo no cartão corporativo da Presidência',
  'Poder360',
  'https://www.poder360.com.br/poder-governo/tcu-mostra-99-de-sigilo-no-cartao-corporativo-da-presidencia/',
);
const IPCA = f(
  'Tabela 1737 — IPCA, variação acumulada no ano (usada para corrigir os valores)',
  'IBGE / SIDRA',
  'https://sidra.ibge.gov.br/tabela/1737',
);
const CEAPS = f(
  'Dados abertos da cota parlamentar (CEAPS), arquivos de 2019 a 2026',
  'Senado Federal',
  'https://www12.senado.leg.br/transparencia/dados-abertos-transparencia/dados-abertos-ceaps',
);
const SENADO_FLAVIO = f(
  'Transparência do senador Flávio Bolsonaro (gastos, pessoal e moradia por ano)',
  'Senado Federal',
  'https://www6g.senado.leg.br/transparencia/sen/5894/',
);

/** Um fato extra dentro do card, com a própria fonte. */
export interface SpendNote {
  text: string;
  sources: SourceReference[];
}

/** Uma linha da série por ano: o valor do candidato e, se houver, a referência do cargo. */
export interface SpendYear {
  year: string;
  main: number;
  reference?: number;
  /** Posição entre os colegas, quando a referência é de colegas do mesmo cargo. */
  rank?: string;
}

/** Card de manchete: um número grande, uma frase, e o detalhe recolhido embaixo. */
export interface SpendHeadline {
  label: string;
  value: string;
  context: string;
  /** 'cargo': custo do mandato; 'campanha': dinheiro público na campanha de 2026. */
  kind: 'cargo' | 'campanha';
  detail: string;
  yearly?: { mainLabel: string; referenceLabel?: string; unit?: string; rows: SpendYear[] };
  notes?: SpendNote[];
  sources: SourceReference[];
}

export interface SpendRecord {
  id: CandidateId;
  mandate: string;
  monthly: { label: string; value: string; detail: string; sources: SourceReference[] }[];
  headlines: SpendHeadline[];
  /** Dinheiro do Orçamento que ele direcionou: não é custo dele, por isso fica à parte. */
  directed?: { label: string; value: string; detail: string; sources: SourceReference[] }[];
  /** Boatos e informações erradas sobre gastos, com a correção. */
  corrections: SpendNote[];
  /** Custos que existem mas não são divulgados. */
  unknown: string;
}

const SALARY = {
  label: 'Salário bruto',
  value: 'R$ 46.366,19',
  detail:
    'Desde fev/2025. É o mesmo valor por lei: presidente, vice, ministros, deputados federais e senadores recebem o mesmo salário, fixado pelo Congresso.',
  sources: [DECRETO_SUBSIDIO],
};

export const SPEND_RECORDS: SpendRecord[] = [
  {
    id: 'lula',
    mandate: 'Presidente, 3º mandato (2023–hoje)',
    monthly: [
      SALARY,
      {
        label: 'Aposentadoria de anistiado',
        value: 'R$ 10.354,22',
        detail:
          'Valor de nov/2021, informado pela assessoria. É a aposentadoria excepcional paga pelo INSS a anistiados políticos. O valor atual não foi localizado.',
        sources: [
          f(
            'Lula não recebe R$ 35 mil de aposentadoria de anistiado político',
            'Aos Fatos',
            'https://www.aosfatos.org/noticias/lula-nao-recebe-r-35-mil-de-aposentadoria-de-anistiado-politico/',
          ),
        ],
      },
    ],
    headlines: [
      {
        label: 'Dinheiro público na campanha',
        value: 'R$ 115,3 mi',
        context: '97% do dinheiro da campanha de 2026 veio dos fundos públicos.',
        kind: 'campanha',
        detail:
          'R$ 115 milhões do fundo eleitoral e R$ 342 mil do fundo partidário, repassados pelo PT. Doações e outros recursos somam R$ 3,1 milhões. Dado parcial (relatório de 20/10/2026); a prestação de contas final vai até novembro.',
        notes: [
          {
            text: 'Até 20/10, a campanha contratou R$ 65,7 milhões em despesas. Quase metade (R$ 31 milhões) foi para uma única agência de comunicação, a Delta3; R$ 2,6 milhões foram para o Facebook.',
            sources: [TSE_CONTAS],
          },
        ],
        sources: [TSE_CONTAS],
      },
      {
        label: 'Viagens da Presidência',
        value: 'R$ 150,5 mi',
        context: 'Diárias, passagens e outros gastos de viagem de 2023 a 2025.',
        kind: 'cargo',
        detail:
          'Valor da Presidência no Portal da Transparência. O sistema não separa o gasto do próprio presidente. Os voos da FAB são sigilosos e não entram. Hospedagem e logística no exterior são pagas à parte, pelo Itamaraty.',
        notes: [
          {
            text: 'Viagens internacionais pagas pelo Itamaraty: R$ 65,9 milhões em 2023 (62 dias fora do país, R$ 27,8 milhões só de hospedagem) e R$ 44,4 milhões em 2025 (16 viagens a 19 países). O valor de 2024 não foi localizado.',
            sources: [
              f(
                'Lula gastou R$ 65,9 mi em 62 dias de viagens ao exterior em 2023',
                'Poder360',
                'https://poder360.com.br/governo/lula-gastou-r-659-mi-em-62-dias-de-viagens-ao-exterior-em-2023',
              ),
              f(
                'Viagens internacionais de Lula custaram R$ 44 mi em 2025',
                'Poder360',
                'https://www.poder360.com.br/poder-governo/viagens-internacionais-de-lula-custaram-44-mi-em-2025/',
              ),
            ],
          },
          {
            text: 'A viagem mais cara de 2025 foi à França: R$ 12 milhões em 6 dias, metade em hospedagem.',
            sources: [
              f(
                'Viagens internacionais de Lula custaram R$ 44 mi em 2025',
                'Poder360',
                'https://www.poder360.com.br/poder-governo/viagens-internacionais-de-lula-custaram-44-mi-em-2025/',
              ),
            ],
          },
          {
            text: 'Referência do cargo: no primeiro ano do governo anterior (2019), as viagens internacionais custaram R$ 38,8 milhões, em valores corrigidos; em 2023, R$ 65,9 milhões.',
            sources: [
              f(
                'Giro internacional de Lula foi R$ 27 mi mais caro que o de Bolsonaro',
                'Poder360',
                'https://www.poder360.com.br/poder-governo/governo/giro-internacional-de-lula-foi-r-27-mi-mais-caro-que-o-de-bolsonaro/',
              ),
            ],
          },
          {
            text: 'O GSI pôs em sigilo a lista de passageiros de pelo menos um voo presidencial (2024). O TCU julgou regulares os gastos de viagem da primeira-dama, Janja (2026).',
            sources: [
              f(
                'Governo põe sigilo sobre lista de passageiros de voo de Lula',
                'Jornal de Brasília (reportagem da Folha)',
                'https://jornaldebrasilia.com.br/noticias/politica-e-poder/governo-poe-sigilo-sobre-lista-de-passageiros-de-voo-de-lula-que-parou-10-min-em-sp/',
              ),
              f(
                'TCU arquiva processo sobre viagens de Janja',
                'Poder360',
                'https://www.poder360.com.br/poder-governo/tcu-arquiva-processo-sobre-viagens-de-janja/',
              ),
            ],
          },
        ],
        sources: [
          f(
            'Lula não gastou R$ 7 bilhões em viagens (dados do Portal da Transparência)',
            'Aos Fatos',
            'https://www.aosfatos.org/noticias/lula-7-bilhoes-viagens/',
          ),
        ],
      },
      {
        label: 'Cartão corporativo da Presidência',
        value: 'R$ 78,1 mi',
        context: 'De jan/2023 a mai/2026. Cerca de 99% é sigiloso.',
        kind: 'cargo',
        detail:
          'Gastos com o cartão de pagamento do governo no órgão Presidência da República, que inclui a estrutura que serve ao presidente (segurança, residências, viagens). Nos gastos sigilosos não se sabe quem recebeu nem o que foi comprado. Em valores de 2025 (corrigidos pelo IPCA), a média foi de R$ 25,2 milhões por ano em 2023–2025; nos governos anteriores com dados disponíveis, R$ 26,4 milhões.',
        yearly: {
          mainLabel: 'Governo atual',
          referenceLabel: 'Média dos governos anteriores com dados (2013–2016 e 2019–2022)',
          unit: 'em R$ de 2025, corrigidos pelo IPCA',
          rows: [
            { year: '2023', main: 25_880_000, reference: 26_350_000 },
            { year: '2024', main: 27_150_000, reference: 26_350_000 },
            { year: '2025', main: 22_570_000, reference: 26_350_000 },
          ],
        },
        notes: [
          {
            text: 'A média dos governos anteriores usa os anos que o site conseguiu baixar do Portal da Transparência: 2013 a 2016 (Dilma e, em 2016, Temer: R$ 28,2 milhões por ano) e 2019 a 2022 (Bolsonaro, R$ 24,5 milhões por ano). Faltam 2017 e 2018, porque o Portal passou a pedir verificação humana no meio do download.',
            sources: [CPGF, IPCA],
          },
          {
            text: 'Sobre o sigilo: o TCU apontou 99,6% de gastos sigilosos de jan/2023 a abr/2025 e citou de 64% a 79% nos governos Dilma e Temer. Nos arquivos do Portal, porém, a parte marcada como sigilosa já passava de 97% em todos os anos de 2013 a 2016. O site não conseguiu conciliar os dois critérios.',
            sources: [TCU_SIGILO, CPGF],
          },
        ],
        sources: [CPGF, TCU_SIGILO, IPCA],
      },
      {
        label: 'Reformas e móveis dos palácios',
        value: 'R$ 26,8 mi',
        context: 'Planalto, Alvorada, Torto e Jaburu, em 2023.',
        kind: 'cargo',
        detail:
          'Reformas e mobiliário das sedes e residências oficiais no primeiro ano do mandato, sem contar manutenção e pessoal.',
        notes: [
          {
            text: 'Só no Alvorada, 11 móveis custaram R$ 379 mil, entre eles um sofá de R$ 65 mil. Segundo a reportagem, o TCU autorizou a compra.',
            sources: [
              f(
                'Compra de móveis para o Alvorada',
                'Poder360',
                'https://www.poder360.com.br/brasil/janja-nos-acusou-so-para-comprar-moveis-sem-licitacao-diz-michelle/',
              ),
            ],
          },
        ],
        sources: [
          f(
            'Governo federal gastou R$ 26,8 milhões em reformas e mobiliário para palácios em 2023 (levantamento do Estadão)',
            'Terra / Estadão',
            'https://www.terra.com.br/amp/noticias/brasil/politica/governo-federal-gastou-r-268-milhoes-em-reformas-e-mobiliario-para-palacios-em-2023,9ec69d9c999271760ae2e6f38f28c7e4wmr8k85z.html',
          ),
        ],
      },
    ],
    corrections: [
      {
        text: '“Lula gastou R$ 1,4 bilhão no cartão corporativo”: enganoso. O valor é o do governo federal inteiro, a maior parte da Defesa Civil, não o da Presidência.',
        sources: [
          f(
            'É verdade que Lula gastou R$ 1,4 bilhão com cartão corporativo?',
            'Estado de Minas',
            'https://www.em.com.br/politica/2026/02/amp/7362447-e-verdade-que-lula-gastou-rs-14-bilhao-com-cartao-corporativo.html',
          ),
        ],
      },
      {
        text: '“Lula recebe R$ 35 mil de aposentadoria”: falso. O INSS informou que o extrato que circulou não confere com a sua base.',
        sources: [
          f(
            'Lula não recebe R$ 35 mil de aposentadoria de anistiado político',
            'Aos Fatos',
            'https://www.aosfatos.org/noticias/lula-nao-recebe-r-35-mil-de-aposentadoria-de-anistiado-politico/',
          ),
        ],
      },
    ],
    unknown:
      'Não são divulgados: o custo dos voos da FAB, da segurança do GSI e da manutenção das residências oficiais, e o conteúdo dos gastos sigilosos do cartão.',
  },
  {
    id: 'flavio',
    mandate: 'Senador (2019–hoje)',
    monthly: [
      SALARY,
      {
        label: 'Moradia',
        value: 'Sem auxílio-moradia',
        detail:
          'Nunca recebeu auxílio-moradia. Usou apartamento funcional do Senado em 2019, 2020 e parte de 2021, inclusive depois de comprar a casa em Brasília.',
        sources: [
          SENADO_FLAVIO,
          f(
            'Apesar de mansão, Flávio Bolsonaro mantém imóvel funcional do Senado',
            'Poder360',
            'https://www.poder360.com.br/congresso/apesar-de-mansao-flavio-bolsonaro-mantem-imovel-funcional-do-senado/',
          ),
        ],
      },
    ],
    headlines: [
      {
        label: 'Dinheiro público na campanha',
        value: 'R$ 60,7 mi',
        context: '64% do dinheiro da campanha de 2026 veio dos fundos públicos.',
        kind: 'campanha',
        detail:
          'R$ 47 milhões do fundo eleitoral e R$ 13,7 milhões do fundo partidário, repassados pelo PL. Doações e outros recursos somam R$ 34,8 milhões. Dado parcial (relatório de 17/10/2026); a prestação de contas final vai até novembro.',
        notes: [
          {
            text: 'Até 17/10, a campanha contratou R$ 74,6 milhões em despesas. As maiores foram com o Facebook (R$ 7,45 milhões em impulsionamento) e com agências de propaganda e de dados.',
            sources: [TSE_CONTAS],
          },
          {
            text: 'Entre as doações, há pessoas físicas que deram de R$ 1 milhão a R$ 2 milhões cada.',
            sources: [TSE_CONTAS],
          },
        ],
        sources: [TSE_CONTAS],
      },
      {
        label: 'Cota parlamentar',
        value: 'R$ 1,23 mi',
        context: 'De fev/2019 a out/2026. Abaixo da mediana dos senadores em todos os anos.',
        kind: 'cargo',
        detail:
          'Reembolsos de passagens, aluguel de escritório, combustível, divulgação e consultorias. Para onde foi: 42% passagens aéreas, 33% aluguel do escritório no Rio, 10% locomoção e combustível, 9% divulgação, 4% consultorias. Soma do site com os arquivos do Senado; bate com a página oficial do senador.',
        yearly: {
          mainLabel: 'Flávio',
          referenceLabel: 'Mediana dos senadores',
          unit: 'em reais da época',
          rows: [
            { year: '2019', main: 180_135.58, reference: 331_910.26, rank: '66º de 76' },
            { year: '2020', main: 86_404.79, reference: 269_148.33, rank: '66º de 67' },
            { year: '2021', main: 135_667.55, reference: 377_224.59, rank: '66º de 72' },
            { year: '2022', main: 250_761.68, reference: 375_954.57, rank: '52º de 66' },
            { year: '2023', main: 122_242.2, reference: 396_938.81, rank: '73º de 77' },
            { year: '2024', main: 180_613.62, reference: 439_633.51, rank: '70º de 75' },
            { year: '2025', main: 189_639.85, reference: 509_016.65, rank: '74º de 79' },
            { year: '2026 (até out)', main: 86_264.27, reference: 343_534.64, rank: '67º de 69' },
          ],
        },
        notes: [
          {
            text: 'A posição conta do maior para o menor gasto entre os senadores que usaram a cota na maior parte do ano: “74º de 79” quer dizer que 73 gastaram mais.',
            sources: [CEAPS],
          },
          {
            text: 'Maiores fornecedores: companhias aéreas (R$ 508 mil no total), uma agência de publicidade (R$ 162 mil em divulgação e consultoria, em 2021 e 2022) e o aluguel do escritório.',
            sources: [CEAPS],
          },
        ],
        sources: [CEAPS, SENADO_FLAVIO],
      },
      {
        label: 'Equipe do gabinete',
        value: 'R$ 491 mil',
        context: 'Por mês, para 21 servidores em Brasília e no Rio (set/2026).',
        kind: 'cargo',
        detail:
          'Salários e auxílios dos servidores do gabinete e do escritório de apoio no Rio, sem encargos e sem terceirizados. Cálculo do site com a folha do Senado.',
        notes: [
          {
            text: 'O gabinete teve entre 16 e 23 servidores por ano desde 2019, mais 4 a 7 no escritório do Rio.',
            sources: [SENADO_FLAVIO],
          },
        ],
        sources: [
          f(
            'Remunerações de servidores do Senado (set/2026) e lotação dos servidores ativos',
            'Senado Federal / Dados Abertos',
            'https://legis.senado.leg.br/dadosabertos/servidores/remuneracoes/2026/9',
          ),
        ],
      },
      {
        label: 'Outros gastos do gabinete',
        value: 'R$ 924 mil',
        context: 'Pagos pelo Senado fora da cota, de 2019 a 2026.',
        kind: 'cargo',
        detail:
          'A maior parte em correios (cerca de R$ 155 mil por ano em 2023, 2024 e 2025), além de diárias, material e R$ 19 mil em impulsionamento de publicações em 2023.',
        sources: [SENADO_FLAVIO],
      },
    ],
    directed: [
      {
        label: 'Emendas indicadas por ele',
        value: 'R$ 364 milhões (2020–2026)',
        detail:
          'Dinheiro do Orçamento federal que ele indicou para estados, cidades e órgãos, corrigido pela inflação; R$ 245 milhões já foram pagos. A maior parte foi para saúde, defesa e segurança pública, e nada para agricultura, ciência e cultura. Quem gasta é o órgão que recebe. De uma emenda para a saúde de Mesquita (RJ), R$ 666 mil foram pagos a uma entidade que a Receita classifica como inexistente de fato.',
        sources: [
          f(
            'Flávio Bolsonaro concentrou emendas em segurança e defesa (dados do Siga Brasil)',
            'Folhapress / Jornal de Brasília',
            'https://jornaldebrasilia.com.br/noticias/politica-e-poder/flavio-bolsonaro-concentrou-emendas-em-seguranca-e-defesa-e-deixou-ciencia-e-agricultura-de-fora/',
          ),
          f(
            'Emendas de Flávio pagaram entidades e empresas sob investigação',
            'Estado de Minas (reportagem do UOL)',
            'https://www.em.com.br/politica/2026/10/7512265-emendas-de-flavio-pagaram-entidades-e-empresas-sob-investigacao.html',
          ),
        ],
      },
    ],
    corrections: [
      {
        text: 'Uma reportagem de 21/10/2026 afirmou que ele recebe auxílio-moradia de R$ 5,5 mil. Os dados do Senado mostram que ele nunca recebeu o auxílio.',
        sources: [
          f(
            'Esses são os salários de Lula e Flávio',
            'Correio Braziliense / 1News',
            'https://1news.correiobraziliense.com.br/noticia/899506/noticias/esses-sao-os-salarios-de-lula-e-flavio-um-deles-ainda-recebe-auxilio-mensal-de-r-55-mil-21102026',
          ),
          SENADO_FLAVIO,
        ],
      },
    ],
    unknown:
      'Não são divulgados por senador: o custo do plano de saúde e o do apartamento funcional que ele usou de 2019 a 2021.',
  },
];

/** Cuidados para ler esta parte. */
export const SPEND_READING = [
  'Esta parte não compara os dois: presidente e senador têm estruturas e responsabilidades de níveis diferentes. Cada coluna mostra só os custos daquele candidato e, quando existe, a média do próprio cargo como referência.',
  'O site não soma os itens num total, porque eles podem se sobrepor (uma viagem pode ser paga em parte com o cartão corporativo) e cobrem períodos diferentes.',
  'O dinheiro público da campanha vem do fundo eleitoral e do fundo partidário. Quanto cada candidato recebe é decidido pelo partido dele.',
  'Os dados de 2026 são parciais e serão atualizados com as prestações de contas finais.',
  'Os mandatos anteriores (desde 2003) ainda não entraram e serão analisados numa próxima etapa.',
];
