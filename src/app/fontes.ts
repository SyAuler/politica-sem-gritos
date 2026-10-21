// Fontes citadas no site. Cada uma guarda título, quem publicou, link e data de acesso.
import { SourceReference } from './models';

/** Data da última revisão do conteúdo; também vira a data de acesso de cada fonte. */
export const UPDATED_AT = '2026-10-14';

export const src = (title: string, publisher: string, url: string): SourceReference => ({
  title,
  publisher,
  url,
  accessedAt: UPDATED_AT,
});

export const S = {
  tsePresidente: src(
    'Resultado oficial do 1º turno para Presidente (totalização de 05/10/2026)',
    'Tribunal Superior Eleitoral',
    'https://resultados.tse.jus.br/oficial/ele2026/6257/dados/br/br-c0001-e006257-u.json',
  ),
  tseResultados: src(
    'Resultados das Eleições 2026 — deputados federais e senadores eleitos, por estado',
    'Tribunal Superior Eleitoral',
    'https://resultados.tse.jus.br/',
  ),
  planoFlavio: src(
    'Diretrizes do Plano de Governo 2027–2030, “Para o Brasil vencer o atraso” (PDF registrado no TSE)',
    'TSE / DivulgaCandContas',
    'https://divulgacandcontas.tse.jus.br/divulga/#/candidato/BR/BR/20322002026/280002551544/2026/BR',
  ),
  planoLula: src(
    'Diretrizes para o Programa de Transformação do Brasil (PDF registrado no TSE)',
    'TSE / DivulgaCandContas',
    'https://divulgacandcontas.tse.jus.br/divulga/#/candidato/BR/BR/20322002026/280002542548/2026/BR',
  ),
  wikiLula: src(
    'Luiz Inácio Lula da Silva (biografia)',
    'Wikipédia',
    'https://pt.wikipedia.org/wiki/Luiz_In%C3%A1cio_Lula_da_Silva',
  ),
  wikiFlavio: src(
    'Flávio Bolsonaro (biografia)',
    'Wikipédia',
    'https://pt.wikipedia.org/wiki/Fl%C3%A1vio_Bolsonaro',
  ),
  wiki: src(
    '2026 Brazilian general election (resultado do 1º turno e coligações)',
    'Wikipedia',
    'https://en.wikipedia.org/wiki/2026_Brazilian_general_election',
  ),
  cnnSenado: src(
    'PL elege 19 senadores e terá a maior bancada do Senado; veja divisão',
    'CNN Brasil',
    'https://www.cnnbrasil.com.br/eleicoes/divisao-bancada-senado/',
  ),
  agBrasilSenado: src(
    'PL elege 19 senadores e soma 28; MDB conquista sete vagas e PT, seis',
    'Agência Brasil',
    'https://agenciabrasil.ebc.com.br/politica/noticia/2026-10/pl-elege-19-senadores-e-soma-28-mdb-conquista-sete-vagas-e-pt-seis',
  ),
  constituicao: src(
    'Constituição Federal — arts. 47, 52, 60, 66 e 69 (quóruns de votação)',
    'Planalto',
    'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm',
  ),
  sidraIpca: src(
    'Tabela 1737 — IPCA, variação acumulada em 12 meses',
    'IBGE / SIDRA',
    'https://sidra.ibge.gov.br/tabela/1737',
  ),
  sidraRenda: src(
    'Tabela 6390 — Rendimento médio mensal real habitual de todos os trabalhos (PNAD Contínua)',
    'IBGE / SIDRA',
    'https://sidra.ibge.gov.br/tabela/6390',
  ),
  ipeaSalMin: src(
    'Salário mínimo vigente (série mensal MTE12_SALMIN12)',
    'Ipeadata / Ministério do Trabalho',
    'https://www.ipeadata.gov.br/ExibeSerie.aspx?serid=1739471028',
  ),
  sidraIpcaIndice: src(
    'Tabela 1737 — IPCA, número-índice (usado para trazer o salário mínimo a valores de hoje)',
    'IBGE / SIDRA',
    'https://sidra.ibge.gov.br/tabela/1737',
  ),
  sidraPnad: src(
    'Tabela 6381 — Taxa de desocupação, trimestres móveis (PNAD Contínua)',
    'IBGE / SIDRA',
    'https://sidra.ibge.gov.br/tabela/6381',
  ),
  acessaPnad: src(
    'Taxa de desemprego fica em 5,3% no trimestre até agosto, revela IBGE',
    'Acessa.com',
    'https://www.acessa.com/economia/2026/09/341214-taxa-de-desemprego-fica-em-53-no-trimestre-ate-agosto-revela-ibge.html',
  ),
  selic: src(
    'Nova taxa Selic chega em setembro ao patamar projetado para dezembro',
    'Economic News Brasil',
    'https://economicnewsbrasil.com.br/2026/09/16/nova-taxa-selic-projecao-dezembro-2026/',
  ),
  bcbSelic: src(
    'Taxas de juros básicas — histórico das decisões do Copom',
    'Banco Central do Brasil',
    'https://www.bcb.gov.br/controleinflacao/historicotaxasjuros',
  ),
  sgsSelic: src(
    'Série 432 — Meta Selic definida pelo Copom (% a.a.), consulta da última década',
    'Banco Central do Brasil / SGS',
    'https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados?formato=json&dataInicial=01/01/2016&dataFinal=31/12/2025',
  ),
  sgsDivida: src(
    'Série 13762 — Dívida bruta do governo geral (% do PIB), metodologia a partir de 2008',
    'Banco Central do Brasil / SGS',
    'https://api.bcb.gov.br/dados/serie/bcdata.sgs.13762/dados?formato=json&dataInicial=01/12/2006&dataFinal=31/08/2026',
  ),
  bcbFiscais: src(
    'Estatísticas fiscais — nota mensal com a dívida do setor público',
    'Banco Central do Brasil',
    'https://www.bcb.gov.br/estatisticas/estatisticasfiscais',
  ),
  sgsDividaFatores: src(
    'Séries 5751, 5753, 5784 e 5786 — juros nominais e resultado primário (% do PIB, 12 meses), governo federal, estados e municípios',
    'Banco Central do Brasil / SGS',
    'https://api.bcb.gov.br/dados/serie/bcdata.sgs.5751/dados?formato=json&dataInicial=01/12/2006&dataFinal=31/12/2025',
  ),
  sgsPib: src(
    'Série 4382 — PIB acumulado dos últimos 12 meses, em R$ milhões',
    'Banco Central do Brasil / SGS',
    'https://api.bcb.gov.br/dados/serie/bcdata.sgs.4382/dados?formato=json&dataInicial=01/12/2006&dataFinal=30/09/2026',
  ),
  sgsPibReal: src(
    'Série 7326 — PIB, variação real no ano (%)',
    'Banco Central do Brasil / SGS (dados do IBGE)',
    'https://api.bcb.gov.br/dados/serie/bcdata.sgs.7326/dados?formato=json',
  ),
  bcbFatores2013: src(
    'Boxe “Fatores condicionantes da evolução da dívida bruta do governo geral” (Relatório de Inflação, mar/2013)',
    'Banco Central do Brasil',
    'https://www.bcb.gov.br/htms/relinf/port/2013/06/ri201306b4p.pdf',
  ),
  lc179: src(
    'Lei Complementar 179/2021 — autonomia do Banco Central',
    'Planalto',
    'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp179.htm',
  ),
  senadoAutoriasFlavio: src(
    'Proposições com autoria do senador Flávio Bolsonaro (código 5894): situação de cada uma e norma gerada',
    'Senado Federal / Dados Abertos',
    'https://legis.senado.leg.br/dadosabertos/processo?codigoParlamentarAutor=5894',
  ),
  senadoPerfilFlavio: src(
    'Senador Flávio Bolsonaro — perfil, autorias e relatorias',
    'Senado Federal',
    'https://www25.senado.leg.br/web/senadores/senador/-/perfil/5894',
  ),
  folhaFlavioLeis: src(
    'Flávio Bolsonaro mirou segurança, mas não teve projetos próprios transformados em lei (Folha de S.Paulo, 30/05/2026)',
    'Folhapress, republicado por Acessa.com',
    'https://www.acessa.com/politica/2026/05/327883-flavio-bolsonaro-mirou-seguranca-mas-nao-teve-projetos-proprios-transformados-em-lei.html',
  ),
  cfLulaFlavioCongresso: src(
    'O que Lula e Flávio fizeram no Congresso antes de disputar o Planalto (14/10/2026)',
    'Congresso em Foco',
    'https://www.congressoemfoco.com.br/noticia/123248/o-que-lula-e-flavio-fizeram-no-congresso-antes-de-disputar-o-planalto',
  ),
  aosFatosPlsExecutivo: src(
    'Lula engana ao falar sobre relação com o Congresso (projetos do Executivo que viraram norma, por presidente; 06/02/2025)',
    'Aos Fatos',
    'https://www.aosfatos.org/noticias/lula-engana-frases-relacao-com-congresso/',
  ),
  poder360Mps: src(
    'Lula tem menor taxa de aprovação de MPs desde 2003 (24/01/2026)',
    'Poder360',
    'https://www.poder360.com.br/poder-congresso/lula-tem-menor-taxa-de-aprovacao-de-mps-desde-2003/',
  ),
  camaraBolsaFamilia: src(
    'MP 132/2003 (Poder Executivo) — cria o Bolsa Família; transformada na Lei 10.836/2004',
    'Câmara dos Deputados',
    'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=138604',
  ),
  camaraMariaDaPenha: src(
    'PL 4.559/2004 (Poder Executivo) — violência doméstica; transformado na Lei 11.340/2006 (Maria da Penha)',
    'Câmara dos Deputados',
    'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=272058',
  ),
  camaraArcabouco: src(
    'PLP 93/2023 (Poder Executivo) — regime fiscal sustentável; transformado na Lei Complementar 200/2023',
    'Câmara dos Deputados',
    'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2357053',
  ),
  camaraIr5mil: src(
    'PL 1.087/2025 (Poder Executivo) — redução do IR até R$ 5 mil e tributação mínima de altas rendas; transformado na Lei 15.270/2025',
    'Câmara dos Deputados',
    'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=2487436',
  ),
  camaraSaidinha: src(
    'PL 2.253/2022 — fim da saída temporária de presos; transformado na Lei 14.843/2024 (relator no Senado: Flávio Bolsonaro)',
    'Câmara dos Deputados',
    'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=493361',
  ),
  senadoPec72: src(
    'PEC 72/2023 (1º autor: Cleitinho; Flávio Bolsonaro entre os coautores) — IPVA de veículos com 20 anos ou mais; virou a Emenda Constitucional 137/2025',
    'Senado Federal',
    'https://www25.senado.leg.br/web/atividade/materias/-/materia/161820',
  ),
  senadoPl3190: src(
    'PL 3.190/2023 (1º autor: Esperidião Amin; Flávio Bolsonaro entre os coautores) — microcrédito; virou a Lei 15.364/2026, com vetos',
    'Senado Federal',
    'https://www25.senado.leg.br/web/atividade/materias/-/materia/158350',
  ),
  camaraLulaDeputado: src(
    'Proposições do deputado Luiz Inácio Lula da Silva (1987–1991), com a situação de cada uma',
    'Câmara dos Deputados / Dados Abertos',
    'https://dadosabertos.camara.leg.br/api/v2/proposicoes?idDeputadoAutor=139289&siglaTipo=PL',
  ),
};
