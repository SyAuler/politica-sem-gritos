// ARQUIVO GERADO por scripts/orcamento/gera_dados_site.py. Não edite à mão: rode o script.
// Arrecadação: Receita Federal (série histórica das receitas federais). Despesa por área e por
// órgão: orçamento federal executado (SIOP, endpoint SPARQL de orcamento.dados.gov.br).
// Valores em R$ bilhões (áreas e arrecadação) ou R$ milhões (órgãos); "real" = R$ de 2025 (IPCA).

export const ARRECADACAO = [
  {
    year: 2003,
    nominal: 356.0,
    real: 1195.2,
  },
  {
    year: 2004,
    nominal: 418.8,
    real: 1319.0,
  },
  {
    year: 2005,
    nominal: 474.6,
    real: 1398.6,
  },
  {
    year: 2006,
    nominal: 535.4,
    real: 1514.5,
  },
  {
    year: 2007,
    nominal: 618.0,
    real: 1686.7,
  },
  {
    year: 2008,
    nominal: 701.7,
    real: 1812.2,
  },
  {
    year: 2009,
    nominal: 716.8,
    real: 1764.9,
  },
  {
    year: 2010,
    nominal: 826.5,
    real: 1937.4,
  },
  {
    year: 2011,
    nominal: 969.9,
    real: 2132.1,
  },
  {
    year: 2012,
    nominal: 1029.3,
    real: 2146.7,
  },
  {
    year: 2013,
    nominal: 1138.8,
    real: 2236.3,
  },
  {
    year: 2014,
    nominal: 1188.0,
    real: 2194.0,
  },
  {
    year: 2015,
    nominal: 1221.5,
    real: 2069.1,
  },
  {
    year: 2016,
    nominal: 1289.9,
    real: 2009.3,
  },
  {
    year: 2017,
    nominal: 1342.4,
    real: 2021.5,
  },
  {
    year: 2018,
    nominal: 1457.1,
    real: 2116.6,
  },
  {
    year: 2019,
    nominal: 1537.1,
    real: 2152.5,
  },
  {
    year: 2020,
    nominal: 1479.4,
    real: 2007.2,
  },
  {
    year: 2021,
    nominal: 1878.8,
    real: 2353.7,
  },
  {
    year: 2022,
    nominal: 2218.5,
    real: 2543.2,
  },
  {
    year: 2023,
    nominal: 2318.1,
    real: 2540.7,
  },
  {
    year: 2024,
    nominal: 2652.7,
    real: 2785.8,
  },
  {
    year: 2025,
    nominal: 2886.9,
    real: 2886.9,
  },
];

export const DESPESA_AREAS = [
  {
    key: 'total',
    label: 'Gasto total (sem a rolagem da dívida)',
    series: [
      {
        year: 2003,
        real: 1685.7,
      },
      {
        year: 2004,
        real: 1736.3,
      },
      {
        year: 2005,
        real: 1801.2,
      },
      {
        year: 2006,
        real: 2267.7,
      },
      {
        year: 2007,
        real: 2289.0,
      },
      {
        year: 2008,
        real: 2506.7,
      },
      {
        year: 2009,
        real: 2809.2,
      },
      {
        year: 2010,
        real: 2620.8,
      },
      {
        year: 2011,
        real: 2618.6,
      },
      {
        year: 2012,
        real: 3173.0,
      },
      {
        year: 2013,
        real: 2841.9,
      },
      {
        year: 2014,
        real: 3054.5,
      },
      {
        year: 2015,
        real: 2855.2,
      },
      {
        year: 2016,
        real: 2953.0,
      },
      {
        year: 2017,
        real: 3018.2,
      },
      {
        year: 2018,
        real: 3188.9,
      },
      {
        year: 2019,
        real: 3169.8,
      },
      {
        year: 2020,
        real: 3871.8,
      },
      {
        year: 2021,
        real: 3140.3,
      },
      {
        year: 2022,
        real: 3082.6,
      },
      {
        year: 2023,
        real: 3254.2,
      },
      {
        year: 2024,
        real: 3636.9,
      },
      {
        year: 2025,
        real: 3719.2,
      },
    ],
  },
  {
    key: 'previdencia',
    label: 'Previdência (INSS e aposentadorias de servidores)',
    series: [
      {
        year: 2003,
        real: 488.5,
      },
      {
        year: 2004,
        real: 521.2,
      },
      {
        year: 2005,
        real: 555.5,
      },
      {
        year: 2006,
        real: 601.1,
      },
      {
        year: 2007,
        real: 638.4,
      },
      {
        year: 2008,
        real: 666.6,
      },
      {
        year: 2009,
        real: 715.3,
      },
      {
        year: 2010,
        real: 763.7,
      },
      {
        year: 2011,
        real: 789.8,
      },
      {
        year: 2012,
        real: 832.8,
      },
      {
        year: 2013,
        real: 874.4,
      },
      {
        year: 2014,
        real: 913.1,
      },
      {
        year: 2015,
        real: 914.2,
      },
      {
        year: 2016,
        real: 925.1,
      },
      {
        year: 2017,
        real: 985.6,
      },
      {
        year: 2018,
        real: 990.2,
      },
      {
        year: 2019,
        real: 1016.5,
      },
      {
        year: 2020,
        real: 1036.8,
      },
      {
        year: 2021,
        real: 1007.8,
      },
      {
        year: 2022,
        real: 1025.8,
      },
      {
        year: 2023,
        real: 1067.0,
      },
      {
        year: 2024,
        real: 1099.3,
      },
      {
        year: 2025,
        real: 1101.5,
      },
    ],
  },
  {
    key: 'transferencias',
    label: 'Repasses a estados e municípios',
    series: [
      {
        year: 2003,
        real: 218.9,
      },
      {
        year: 2004,
        real: 227.1,
      },
      {
        year: 2005,
        real: 277.3,
      },
      {
        year: 2006,
        real: 282.3,
      },
      {
        year: 2007,
        real: 308.7,
      },
      {
        year: 2008,
        real: 362.3,
      },
      {
        year: 2009,
        real: 339.1,
      },
      {
        year: 2010,
        real: 353.3,
      },
      {
        year: 2011,
        real: 394.4,
      },
      {
        year: 2012,
        real: 400.0,
      },
      {
        year: 2013,
        real: 421.8,
      },
      {
        year: 2014,
        real: 432.3,
      },
      {
        year: 2015,
        real: 351.8,
      },
      {
        year: 2016,
        real: 370.9,
      },
      {
        year: 2017,
        real: 349.7,
      },
      {
        year: 2018,
        real: 373.5,
      },
      {
        year: 2019,
        real: 384.8,
      },
      {
        year: 2020,
        real: 469.2,
      },
      {
        year: 2021,
        real: 440.1,
      },
      {
        year: 2022,
        real: 507.7,
      },
      {
        year: 2023,
        real: 523.1,
      },
      {
        year: 2024,
        real: 553.2,
      },
      {
        year: 2025,
        real: 571.9,
      },
    ],
  },
  {
    key: 'juros',
    label: 'Juros da dívida',
    series: [
      {
        year: 2003,
        real: 214.5,
      },
      {
        year: 2004,
        real: 231.2,
      },
      {
        year: 2005,
        real: 264.6,
      },
      {
        year: 2006,
        real: 424.6,
      },
      {
        year: 2007,
        real: 376.9,
      },
      {
        year: 2008,
        real: 275.0,
      },
      {
        year: 2009,
        real: 298.4,
      },
      {
        year: 2010,
        real: 283.6,
      },
      {
        year: 2011,
        real: 288.0,
      },
      {
        year: 2012,
        real: 262.8,
      },
      {
        year: 2013,
        real: 278.3,
      },
      {
        year: 2014,
        real: 308.6,
      },
      {
        year: 2015,
        real: 353.0,
      },
      {
        year: 2016,
        real: 308.4,
      },
      {
        year: 2017,
        real: 297.6,
      },
      {
        year: 2018,
        real: 393.7,
      },
      {
        year: 2019,
        real: 394.9,
      },
      {
        year: 2020,
        real: 467.5,
      },
      {
        year: 2021,
        real: 321.0,
      },
      {
        year: 2022,
        real: 283.5,
      },
      {
        year: 2023,
        real: 263.8,
      },
      {
        year: 2024,
        real: 365.2,
      },
      {
        year: 2025,
        real: 350.7,
      },
    ],
  },
  {
    key: 'assistencia',
    label: 'Assistência social (Bolsa Família, BPC)',
    series: [
      {
        year: 2003,
        real: 28.2,
      },
      {
        year: 2004,
        real: 43.8,
      },
      {
        year: 2005,
        real: 46.6,
      },
      {
        year: 2006,
        real: 61.1,
      },
      {
        year: 2007,
        real: 67.4,
      },
      {
        year: 2008,
        real: 74.4,
      },
      {
        year: 2009,
        real: 82.0,
      },
      {
        year: 2010,
        real: 91.7,
      },
      {
        year: 2011,
        real: 100.2,
      },
      {
        year: 2012,
        real: 118.0,
      },
      {
        year: 2013,
        real: 126.9,
      },
      {
        year: 2014,
        real: 130.0,
      },
      {
        year: 2015,
        real: 119.8,
      },
      {
        year: 2016,
        real: 121.8,
      },
      {
        year: 2017,
        real: 126.6,
      },
      {
        year: 2018,
        real: 127.8,
      },
      {
        year: 2019,
        real: 132.9,
      },
      {
        year: 2020,
        real: 559.4,
      },
      {
        year: 2021,
        real: 201.8,
      },
      {
        year: 2022,
        real: 225.7,
      },
      {
        year: 2023,
        real: 290.9,
      },
      {
        year: 2024,
        real: 297.3,
      },
      {
        year: 2025,
        real: 289.2,
      },
    ],
  },
  {
    key: 'saude',
    label: 'Saúde',
    series: [
      {
        year: 2003,
        real: 91.3,
      },
      {
        year: 2004,
        real: 103.9,
      },
      {
        year: 2005,
        real: 107.6,
      },
      {
        year: 2006,
        real: 112.3,
      },
      {
        year: 2007,
        real: 122.5,
      },
      {
        year: 2008,
        real: 127.1,
      },
      {
        year: 2009,
        real: 140.6,
      },
      {
        year: 2010,
        real: 142.1,
      },
      {
        year: 2011,
        real: 155.9,
      },
      {
        year: 2012,
        real: 163.9,
      },
      {
        year: 2013,
        real: 164.6,
      },
      {
        year: 2014,
        real: 170.8,
      },
      {
        year: 2015,
        real: 157.4,
      },
      {
        year: 2016,
        real: 153.9,
      },
      {
        year: 2017,
        real: 152.7,
      },
      {
        year: 2018,
        real: 156.6,
      },
      {
        year: 2019,
        real: 159.5,
      },
      {
        year: 2020,
        real: 205.0,
      },
      {
        year: 2021,
        real: 202.2,
      },
      {
        year: 2022,
        real: 156.1,
      },
      {
        year: 2023,
        real: 176.1,
      },
      {
        year: 2024,
        real: 204.6,
      },
      {
        year: 2025,
        real: 217.1,
      },
    ],
  },
  {
    key: 'educacao',
    label: 'Educação',
    series: [
      {
        year: 2003,
        real: 47.7,
      },
      {
        year: 2004,
        real: 45.7,
      },
      {
        year: 2005,
        real: 47.7,
      },
      {
        year: 2006,
        real: 48.9,
      },
      {
        year: 2007,
        real: 58.7,
      },
      {
        year: 2008,
        real: 64.8,
      },
      {
        year: 2009,
        real: 81.5,
      },
      {
        year: 2010,
        real: 103.4,
      },
      {
        year: 2011,
        real: 116.3,
      },
      {
        year: 2012,
        real: 136.4,
      },
      {
        year: 2013,
        real: 148.5,
      },
      {
        year: 2014,
        real: 157.7,
      },
      {
        year: 2015,
        real: 135.5,
      },
      {
        year: 2016,
        real: 132.3,
      },
      {
        year: 2017,
        real: 133.4,
      },
      {
        year: 2018,
        real: 132.0,
      },
      {
        year: 2019,
        real: 123.5,
      },
      {
        year: 2020,
        real: 111.5,
      },
      {
        year: 2021,
        real: 112.9,
      },
      {
        year: 2022,
        real: 119.8,
      },
      {
        year: 2023,
        real: 137.3,
      },
      {
        year: 2024,
        real: 139.3,
      },
      {
        year: 2025,
        real: 157.0,
      },
    ],
  },
  {
    key: 'trabalho',
    label: 'Trabalho (seguro-desemprego, abono)',
    series: [
      {
        year: 2003,
        real: 31.9,
      },
      {
        year: 2004,
        real: 33.7,
      },
      {
        year: 2005,
        real: 37.4,
      },
      {
        year: 2006,
        real: 46.4,
      },
      {
        year: 2007,
        real: 53.5,
      },
      {
        year: 2008,
        real: 58.1,
      },
      {
        year: 2009,
        real: 71.7,
      },
      {
        year: 2010,
        real: 73.1,
      },
      {
        year: 2011,
        real: 79.6,
      },
      {
        year: 2012,
        real: 88.2,
      },
      {
        year: 2013,
        real: 129.4,
      },
      {
        year: 2014,
        real: 131.9,
      },
      {
        year: 2015,
        real: 110.3,
      },
      {
        year: 2016,
        real: 109.0,
      },
      {
        year: 2017,
        real: 105.3,
      },
      {
        year: 2018,
        real: 103.0,
      },
      {
        year: 2019,
        real: 101.5,
      },
      {
        year: 2020,
        real: 103.0,
      },
      {
        year: 2021,
        real: 82.4,
      },
      {
        year: 2022,
        real: 105.9,
      },
      {
        year: 2023,
        real: 104.5,
      },
      {
        year: 2024,
        real: 114.4,
      },
      {
        year: 2025,
        real: 115.8,
      },
    ],
  },
  {
    key: 'defesa',
    label: 'Defesa',
    series: [
      {
        year: 2003,
        real: 38.9,
      },
      {
        year: 2004,
        real: 42.8,
      },
      {
        year: 2005,
        real: 45.4,
      },
      {
        year: 2006,
        real: 47.0,
      },
      {
        year: 2007,
        real: 52.7,
      },
      {
        year: 2008,
        real: 57.3,
      },
      {
        year: 2009,
        real: 63.5,
      },
      {
        year: 2010,
        real: 74.5,
      },
      {
        year: 2011,
        real: 70.1,
      },
      {
        year: 2012,
        real: 76.3,
      },
      {
        year: 2013,
        real: 73.2,
      },
      {
        year: 2014,
        real: 73.3,
      },
      {
        year: 2015,
        real: 60.5,
      },
      {
        year: 2016,
        real: 88.8,
      },
      {
        year: 2017,
        real: 95.2,
      },
      {
        year: 2018,
        real: 103.3,
      },
      {
        year: 2019,
        real: 109.9,
      },
      {
        year: 2020,
        real: 103.9,
      },
      {
        year: 2021,
        real: 98.0,
      },
      {
        year: 2022,
        real: 93.2,
      },
      {
        year: 2023,
        real: 90.3,
      },
      {
        year: 2024,
        real: 91.6,
      },
      {
        year: 2025,
        real: 91.6,
      },
    ],
  },
  {
    key: 'seguranca',
    label: 'Segurança pública',
    series: [
      {
        year: 2003,
        real: 8.1,
      },
      {
        year: 2004,
        real: 8.8,
      },
      {
        year: 2005,
        real: 8.8,
      },
      {
        year: 2006,
        real: 9.6,
      },
      {
        year: 2007,
        real: 13.1,
      },
      {
        year: 2008,
        real: 15.5,
      },
      {
        year: 2009,
        real: 18.0,
      },
      {
        year: 2010,
        real: 21.1,
      },
      {
        year: 2011,
        real: 15.4,
      },
      {
        year: 2012,
        real: 16.5,
      },
      {
        year: 2013,
        real: 16.3,
      },
      {
        year: 2014,
        real: 15.0,
      },
      {
        year: 2015,
        real: 11.9,
      },
      {
        year: 2016,
        real: 11.8,
      },
      {
        year: 2017,
        real: 12.2,
      },
      {
        year: 2018,
        real: 11.9,
      },
      {
        year: 2019,
        real: 11.8,
      },
      {
        year: 2020,
        real: 13.4,
      },
      {
        year: 2021,
        real: 12.0,
      },
      {
        year: 2022,
        real: 12.6,
      },
      {
        year: 2023,
        real: 13.6,
      },
      {
        year: 2024,
        real: 16.8,
      },
      {
        year: 2025,
        real: 13.9,
      },
    ],
  },
];

export const POR_100_2025 = [
  {
    key: 'previdencia',
    label: 'Previdência',
    bi: 1101.5,
    pct: 29.62,
    squares: 30,
  },
  {
    key: 'transferencias',
    label: 'Repasses a estados e municípios',
    bi: 571.9,
    pct: 15.38,
    squares: 15,
  },
  {
    key: 'divida',
    label: 'Dívida pública (juros e parte do principal)',
    bi: 602.7,
    pct: 16.21,
    squares: 16,
  },
  {
    key: 'encargos',
    label: 'Outros encargos (precatórios, pensões militares, Banco Central)',
    bi: 350.3,
    pct: 9.42,
    squares: 9,
  },
  {
    key: 'assistencia',
    label: 'Assistência social',
    bi: 289.2,
    pct: 7.78,
    squares: 8,
  },
  {
    key: 'saude',
    label: 'Saúde',
    bi: 217.1,
    pct: 5.84,
    squares: 6,
  },
  {
    key: 'educacao',
    label: 'Educação',
    bi: 157.0,
    pct: 4.22,
    squares: 4,
  },
  {
    key: 'demais',
    label: 'Todas as outras áreas (trabalho, defesa, Justiça, Congresso, segurança...)',
    bi: 429.5,
    pct: 11.55,
    squares: 12,
  },
];

/** Saída por ano nos mesmos grupos da grade de R$ 100 (R$ bi de 2025). */
export const SAIDA_GRUPOS = [
  {
    year: 2003,
    previdencia: 488.5,
    transferencias: 218.9,
    divida: 474.0,
    encargos: 111.8,
    assistencia: 28.2,
    saude: 91.3,
    educacao: 47.7,
    demais: 225.3,
    total: 1685.7,
  },
  {
    year: 2004,
    previdencia: 521.2,
    transferencias: 227.1,
    divida: 460.4,
    encargos: 86.9,
    assistencia: 43.8,
    saude: 103.9,
    educacao: 45.7,
    demais: 247.2,
    total: 1736.3,
  },
  {
    year: 2005,
    previdencia: 555.5,
    transferencias: 277.3,
    divida: 422.3,
    encargos: 72.2,
    assistencia: 46.6,
    saude: 107.6,
    educacao: 47.7,
    demais: 272.0,
    total: 1801.2,
  },
  {
    year: 2006,
    previdencia: 601.1,
    transferencias: 282.3,
    divida: 744.2,
    encargos: 121.1,
    assistencia: 61.1,
    saude: 112.3,
    educacao: 48.9,
    demais: 296.7,
    total: 2267.7,
  },
  {
    year: 2007,
    previdencia: 638.4,
    transferencias: 308.7,
    divida: 521.3,
    encargos: 213.4,
    assistencia: 67.4,
    saude: 122.5,
    educacao: 58.7,
    demais: 358.6,
    total: 2289.0,
  },
  {
    year: 2008,
    previdencia: 666.6,
    transferencias: 362.3,
    divida: 560.9,
    encargos: 280.0,
    assistencia: 74.4,
    saude: 127.1,
    educacao: 64.8,
    demais: 370.6,
    total: 2506.7,
  },
  {
    year: 2009,
    previdencia: 715.3,
    transferencias: 339.1,
    divida: 696.3,
    encargos: 337.3,
    assistencia: 82.0,
    saude: 140.6,
    educacao: 81.5,
    demais: 417.1,
    total: 2809.2,
  },
  {
    year: 2010,
    previdencia: 763.7,
    transferencias: 353.3,
    divida: 492.5,
    encargos: 231.8,
    assistencia: 91.7,
    saude: 142.1,
    educacao: 103.4,
    demais: 442.3,
    total: 2620.8,
  },
  {
    year: 2011,
    previdencia: 789.8,
    transferencias: 394.4,
    divida: 524.5,
    encargos: 120.7,
    assistencia: 100.2,
    saude: 155.9,
    educacao: 116.3,
    demais: 416.8,
    total: 2618.6,
  },
  {
    year: 2012,
    previdencia: 832.8,
    transferencias: 400.0,
    divida: 743.5,
    encargos: 328.5,
    assistencia: 118.0,
    saude: 163.9,
    educacao: 136.4,
    demais: 449.9,
    total: 3173.0,
  },
  {
    year: 2013,
    previdencia: 874.4,
    transferencias: 421.8,
    divida: 522.7,
    encargos: 84.4,
    assistencia: 126.9,
    saude: 164.6,
    educacao: 148.5,
    demais: 498.6,
    total: 2841.9,
  },
  {
    year: 2014,
    previdencia: 913.1,
    transferencias: 432.3,
    divida: 553.5,
    encargos: 226.6,
    assistencia: 130.0,
    saude: 170.8,
    educacao: 157.7,
    demais: 470.4,
    total: 3054.5,
  },
  {
    year: 2015,
    previdencia: 914.2,
    transferencias: 351.8,
    divida: 665.5,
    encargos: 148.0,
    assistencia: 119.8,
    saude: 157.4,
    educacao: 135.5,
    demais: 363.0,
    total: 2855.2,
  },
  {
    year: 2016,
    previdencia: 925.1,
    transferencias: 370.9,
    divida: 598.6,
    encargos: 262.2,
    assistencia: 121.8,
    saude: 153.9,
    educacao: 132.3,
    demais: 388.2,
    total: 2953.0,
  },
  {
    year: 2017,
    previdencia: 985.6,
    transferencias: 349.7,
    divida: 608.7,
    encargos: 276.0,
    assistencia: 126.6,
    saude: 152.7,
    educacao: 133.4,
    demais: 385.5,
    total: 3018.2,
  },
  {
    year: 2018,
    previdencia: 990.2,
    transferencias: 373.5,
    divida: 784.8,
    encargos: 228.6,
    assistencia: 127.8,
    saude: 156.6,
    educacao: 132.0,
    demais: 395.3,
    total: 3188.9,
  },
  {
    year: 2019,
    previdencia: 1016.5,
    transferencias: 384.8,
    divida: 747.2,
    encargos: 220.1,
    assistencia: 132.9,
    saude: 159.5,
    educacao: 123.5,
    demais: 385.2,
    total: 3169.8,
  },
  {
    year: 2020,
    previdencia: 1036.8,
    transferencias: 469.2,
    divida: 869.8,
    encargos: 242.3,
    assistencia: 559.4,
    saude: 205.0,
    educacao: 111.5,
    demais: 377.7,
    total: 3871.8,
  },
  {
    year: 2021,
    previdencia: 1007.8,
    transferencias: 440.1,
    divida: 713.7,
    encargos: 129.5,
    assistencia: 201.8,
    saude: 202.2,
    educacao: 112.9,
    demais: 332.2,
    total: 3140.3,
  },
  {
    year: 2022,
    previdencia: 1025.8,
    transferencias: 507.7,
    divida: 530.2,
    encargos: 158.9,
    assistencia: 225.7,
    saude: 156.1,
    educacao: 119.8,
    demais: 358.4,
    total: 3082.6,
  },
  {
    year: 2023,
    previdencia: 1067.0,
    transferencias: 523.1,
    divida: 468.9,
    encargos: 222.5,
    assistencia: 290.9,
    saude: 176.1,
    educacao: 137.3,
    demais: 368.4,
    total: 3254.2,
  },
  {
    year: 2024,
    previdencia: 1099.3,
    transferencias: 553.2,
    divida: 724.5,
    encargos: 218.0,
    assistencia: 297.3,
    saude: 204.6,
    educacao: 139.3,
    demais: 400.7,
    total: 3636.9,
  },
  {
    year: 2025,
    previdencia: 1101.5,
    transferencias: 571.9,
    divida: 602.7,
    encargos: 350.3,
    assistencia: 289.2,
    saude: 217.1,
    educacao: 157.0,
    demais: 429.5,
    total: 3719.2,
  },
];

export const ORGAOS = [
  {
    key: 'camara',
    label: 'Câmara dos Deputados',
    pago2025: 7026.6,
    perCapita2025: 32.92,
    pctUniao2025: 0.216,
    pessoalPct2025: 80.6,
    inativosPct2025: 31.5,
    perMember2025: 13.7,
    member: 'deputado',
    series: [
      {
        year: 2013,
        real: 8582.1,
      },
      {
        year: 2014,
        real: 8390.9,
      },
      {
        year: 2015,
        real: 8404.3,
      },
      {
        year: 2016,
        real: 8109.2,
      },
      {
        year: 2017,
        real: 8045.1,
      },
      {
        year: 2018,
        real: 7925.9,
      },
      {
        year: 2019,
        real: 8101.4,
      },
      {
        year: 2020,
        real: 7712.5,
      },
      {
        year: 2021,
        real: 7146.7,
      },
      {
        year: 2022,
        real: 6585.2,
      },
      {
        year: 2023,
        real: 6693.6,
      },
      {
        year: 2024,
        real: 6837.2,
      },
      {
        year: 2025,
        real: 7026.6,
      },
    ],
  },
  {
    key: 'senado',
    label: 'Senado Federal',
    pago2025: 5855.9,
    perCapita2025: 27.44,
    pctUniao2025: 0.18,
    pessoalPct2025: 83.1,
    inativosPct2025: 43.8,
    perMember2025: 72.29,
    member: 'senador',
    series: [
      {
        year: 2013,
        real: 6518.0,
      },
      {
        year: 2014,
        real: 6366.5,
      },
      {
        year: 2015,
        real: 6247.4,
      },
      {
        year: 2016,
        real: 5980.9,
      },
      {
        year: 2017,
        real: 6109.7,
      },
      {
        year: 2018,
        real: 5969.1,
      },
      {
        year: 2019,
        real: 6051.1,
      },
      {
        year: 2020,
        real: 5818.0,
      },
      {
        year: 2021,
        real: 5429.5,
      },
      {
        year: 2022,
        real: 4978.4,
      },
      {
        year: 2023,
        real: 5052.6,
      },
      {
        year: 2024,
        real: 5550.0,
      },
      {
        year: 2025,
        real: 5855.9,
      },
    ],
  },
  {
    key: 'stf',
    label: 'Supremo Tribunal Federal',
    pago2025: 913.5,
    perCapita2025: 4.28,
    pctUniao2025: 0.028,
    pessoalPct2025: 64.2,
    inativosPct2025: 19.9,
    perMember2025: 83.04,
    member: 'ministro',
    series: [
      {
        year: 2013,
        real: 888.2,
      },
      {
        year: 2014,
        real: 907.8,
      },
      {
        year: 2015,
        real: 898.4,
      },
      {
        year: 2016,
        real: 864.2,
      },
      {
        year: 2017,
        real: 903.6,
      },
      {
        year: 2018,
        real: 906.1,
      },
      {
        year: 2019,
        real: 978.7,
      },
      {
        year: 2020,
        real: 902.0,
      },
      {
        year: 2021,
        real: 826.6,
      },
      {
        year: 2022,
        real: 771.8,
      },
      {
        year: 2023,
        real: 819.2,
      },
      {
        year: 2024,
        real: 919.5,
      },
      {
        year: 2025,
        real: 913.5,
      },
    ],
  },
  {
    key: 'judiciario_uniao',
    label: 'Judiciário federal (pago pela União)',
    pago2025: 62600.1,
    perCapita2025: 293.32,
    pctUniao2025: 1.925,
    pessoalPct2025: 81.6,
    inativosPct2025: 20.2,
    perMember2025: null,
    member: null,
    series: [
      {
        year: 2013,
        real: 57685.7,
      },
      {
        year: 2014,
        real: 59740.8,
      },
      {
        year: 2015,
        real: 59820.2,
      },
      {
        year: 2016,
        real: 59496.8,
      },
      {
        year: 2017,
        real: 62246.3,
      },
      {
        year: 2018,
        real: 63436.9,
      },
      {
        year: 2019,
        real: 64896.3,
      },
      {
        year: 2020,
        real: 62894.8,
      },
      {
        year: 2021,
        real: 58418.7,
      },
      {
        year: 2022,
        real: 57769.7,
      },
      {
        year: 2023,
        real: 57884.4,
      },
      {
        year: 2024,
        real: 62236.8,
      },
      {
        year: 2025,
        real: 62600.1,
      },
    ],
  },
  {
    key: 'mpu',
    label: 'Ministério Público da União',
    pago2025: 9762.9,
    perCapita2025: 45.74,
    pctUniao2025: 0.3,
    pessoalPct2025: 82.3,
    inativosPct2025: 11.2,
    perMember2025: null,
    member: null,
    series: [
      {
        year: 2013,
        real: 8151.4,
      },
      {
        year: 2014,
        real: 8482.1,
      },
      {
        year: 2015,
        real: 8975.6,
      },
      {
        year: 2016,
        real: 8820.0,
      },
      {
        year: 2017,
        real: 9526.7,
      },
      {
        year: 2018,
        real: 9385.4,
      },
      {
        year: 2019,
        real: 9680.9,
      },
      {
        year: 2020,
        real: 9952.5,
      },
      {
        year: 2021,
        real: 9269.9,
      },
      {
        year: 2022,
        real: 9011.3,
      },
      {
        year: 2023,
        real: 9510.9,
      },
      {
        year: 2024,
        real: 9603.8,
      },
      {
        year: 2025,
        real: 9762.9,
      },
    ],
  },
  {
    key: 'tcu',
    label: 'Tribunal de Contas da União',
    pago2025: 2780.0,
    perCapita2025: 13.03,
    pctUniao2025: 0.086,
    pessoalPct2025: 82.7,
    inativosPct2025: 34.1,
    perMember2025: null,
    member: null,
    series: [
      {
        year: 2013,
        real: 2764.1,
      },
      {
        year: 2014,
        real: 2879.0,
      },
      {
        year: 2015,
        real: 2850.1,
      },
      {
        year: 2016,
        real: 2823.0,
      },
      {
        year: 2017,
        real: 2903.5,
      },
      {
        year: 2018,
        real: 2904.9,
      },
      {
        year: 2019,
        real: 2971.7,
      },
      {
        year: 2020,
        real: 2877.1,
      },
      {
        year: 2021,
        real: 2663.0,
      },
      {
        year: 2022,
        real: 2478.3,
      },
      {
        year: 2023,
        real: 2495.2,
      },
      {
        year: 2024,
        real: 2594.4,
      },
      {
        year: 2025,
        real: 2780.0,
      },
    ],
  },
  {
    key: 'presidencia',
    label: 'Presidência da República (unidade da Presidência)',
    pago2025: 1872.4,
    perCapita2025: 8.77,
    pctUniao2025: 0.058,
    pessoalPct2025: 16.7,
    inativosPct2025: 0.0,
    perMember2025: null,
    member: null,
    series: [
      {
        year: 2013,
        real: 872.3,
      },
      {
        year: 2014,
        real: 1052.8,
      },
      {
        year: 2015,
        real: 880.3,
      },
      {
        year: 2016,
        real: 923.5,
      },
      {
        year: 2017,
        real: 831.5,
      },
      {
        year: 2018,
        real: 1215.7,
      },
      {
        year: 2019,
        real: 670.9,
      },
      {
        year: 2020,
        real: 593.1,
      },
      {
        year: 2021,
        real: 367.0,
      },
      {
        year: 2022,
        real: 433.5,
      },
      {
        year: 2023,
        real: 669.9,
      },
      {
        year: 2024,
        real: 859.1,
      },
      {
        year: 2025,
        real: 1872.4,
      },
    ],
  },
];
