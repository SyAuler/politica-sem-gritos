// Processos e investigações de cada candidato: cada decisão com data, quem decidiu e a fonte.
// Regra de entrada: o candidato foi investigado, denunciado ou processado, ou o caso teve
// investigação oficial no governo, no gabinete ou na família dele. Acusação sem
// investigação oficial e disputas da campanha na Justiça Eleitoral ficam de fora.
import { CaseOutcome, CaseRecord } from './models';
import { HISTORICO_AT, src } from './fontes';

const f = (title: string, publisher: string, url: string) =>
  src(title, publisher, url, HISTORICO_AT);

/** Os desfechos possíveis, em linguagem simples. Todo `outcome` usado precisa estar aqui. */
export const CASE_OUTCOMES: {
  key: CaseOutcome;
  label: string;
  /** Como aparece na contagem do resumo: [singular, plural]. */
  count: [string, string];
  text: string;
}[] = [
  {
    key: 'condenado',
    label: 'Condenado',
    count: ['condenação', 'condenações'],
    text: 'A Justiça analisou as provas e considerou a pessoa culpada. Enquanto couber recurso, a condenação não é definitiva.',
  },
  {
    key: 'anulado',
    label: 'Condenação anulada',
    count: ['condenação anulada', 'condenações anuladas'],
    text: 'Um tribunal desfez o processo por um erro de forma, como juiz sem competência, juiz parcial ou prova ilegal. Não diz se a pessoa é culpada ou inocente.',
  },
  {
    key: 'absolvido',
    label: 'Absolvido',
    count: ['absolvição', 'absolvições'],
    text: 'A Justiça analisou as provas e não condenou, por falta de provas ou porque o fato não é crime.',
  },
  {
    key: 'rejeitado',
    label: 'Denúncia rejeitada',
    count: ['denúncia rejeitada', 'denúncias rejeitadas'],
    text: 'O juiz nem abriu o processo: entendeu que a acusação não tinha base suficiente. A pessoa não chega a virar ré.',
  },
  {
    key: 'arquivado',
    label: 'Encerrado sem julgamento',
    count: ['encerrado sem julgamento', 'encerrados sem julgamento'],
    text: 'O caso acabou sem decidir se houve crime: porque o prazo para punir passou (prescrição), porque faltou base para a acusação ou porque as provas foram anuladas. Não é declaração de inocência.',
  },
  {
    key: 'andamento',
    label: 'Em andamento',
    count: ['em andamento', 'em andamento'],
    text: 'Ainda não há decisão final. Ser investigado não é ser acusado, e até a condenação definitiva vale a presunção de inocência.',
  },
  {
    key: 'sem-acusacao',
    label: 'Sem acusação',
    count: ['sem acusação', 'sem acusação'],
    text: 'O candidato não foi acusado. O caso aparece porque teve investigação oficial e envolveu o governo, o gabinete ou pessoas próximas a ele.',
  },
];

export const CASE_GROUPS: { key: 'pessoal' | 'entorno'; label: string }[] = [
  { key: 'pessoal', label: 'Casos em que ele foi alvo' },
  { key: 'entorno', label: 'Outros casos investigados, sem acusação contra ele' },
];

export const CASE_RECORDS: CaseRecord[] = [
  {
    id: 'lula',
    cases: [
      {
        id: 'triplex',
        title: 'Triplex do Guarujá',
        period: '2016–2022',
        group: 'pessoal',
        allegation:
          'O Ministério Público Federal acusou Lula de receber da construtora OAS um apartamento triplex e a reforma dele, em troca de contratos com a Petrobras (corrupção passiva e lavagem de dinheiro).',
        role: 'Réu. Foi condenado em três instâncias e ficou preso.',
        outcome: 'anulado',
        outcomeText:
          'Condenação anulada pelo STF: o juiz não tinha competência para o caso e foi declarado parcial. Depois, o caso foi arquivado por prescrição.',
        timeline: [
          {
            date: '12/07/2017',
            body: '13ª Vara Federal de Curitiba (Sergio Moro)',
            text: 'Condena Lula a 9 anos e 6 meses de prisão.',
            sources: [
              f(
                'Lula é condenado a 9 anos e 6 meses de prisão no processo do triplex',
                'Poder360',
                'https://www.poder360.com.br/eleicoes/lula-e-condenado-a-9-anos-e-6-meses-de-prisao-no-processo-do-triplex/',
              ),
            ],
          },
          {
            date: '24/01/2018',
            body: 'TRF4 (2ª instância)',
            text: 'Mantém a condenação e aumenta a pena para 12 anos e 1 mês.',
            sources: [
              f(
                'Revisor acompanha relator e forma maioria pela condenação de Lula',
                'Conjur',
                'https://www.conjur.com.br/2018-jan-24/revisor-acompanha-relator-forma-maioria-condenacao-lula/',
              ),
            ],
          },
          {
            date: '23/04/2019',
            body: 'STJ',
            text: 'Mantém a condenação e reduz a pena para 8 anos, 10 meses e 20 dias.',
            sources: [
              f(
                'Defesa de Lula diz que vai recorrer para garantir absolvição (STJ reduz pena)',
                'O Povo / Agência Brasil',
                'https://www.opovo.com.br/noticias/politica/2019/04/23/amp/defesa-de-lula-diz-que-vai-recorrer-para-garantir-absolvicao.html',
              ),
            ],
          },
          {
            date: '08/11/2019',
            body: 'Justiça Federal de Curitiba',
            text: 'Lula é solto depois de 580 dias preso, um dia após o STF decidir que a prisão só pode acontecer quando acabam os recursos.',
            sources: [
              f(
                'Lula é solto após decisão do STF sobre prisão em 2ª instância',
                'Gazeta do Povo',
                'https://www.gazetadopovo.com.br/republica/lula-solto-alvara-justica-ex-presidente-lava-jato/',
              ),
            ],
          },
          {
            date: '08/03/2021',
            body: 'STF (ministro Edson Fachin)',
            text: 'Declara que a Justiça Federal de Curitiba não tinha competência para julgar o caso e anula a condenação. O plenário confirma em abril.',
            sources: [
              f(
                'Entenda a decisão do STF que anulou os processos contra Lula',
                'Dizer o Direito',
                'https://www.dizerodireito.com.br/2021/05/entenda-decisao-do-stf-que-anulou-os.html',
              ),
            ],
          },
          {
            date: '23/06/2021',
            body: 'STF (plenário)',
            text: 'Confirma, por 7 a 4, que Sergio Moro foi parcial (suspeito) ao julgar Lula.',
            sources: [
              f(
                'Moro foi suspeito para julgar Lula, decide o STF',
                'Conjur',
                'https://www.conjur.com.br/2021-jun-23/moro-suspeito-julgar-lula-decide-stf-votos/',
              ),
            ],
          },
          {
            date: '27/01/2022',
            body: 'Justiça Federal do DF',
            text: 'Arquiva o caso por prescrição, a pedido do MPF.',
            sources: [
              f(
                'Justiça do DF arquiva caso do triplex do Guarujá atribuído a Lula',
                'Gazeta do Povo',
                'https://www.gazetadopovo.com.br/republica/breves/justica-do-df-arquiva-caso-do-triplex-do-guaruja-atribuido-a-lula-na-lava-jato/',
              ),
            ],
          },
        ],
        meaning:
          'Não existe condenação válida, e o mérito (se houve ou não crime) nunca foi julgado num processo válido. Anulação não é absolvição. Prescrição também não é inocência: quer dizer que acabou o prazo para o Estado punir.',
      },
      {
        id: 'atibaia',
        title: 'Sítio de Atibaia',
        period: '2017–2021',
        group: 'pessoal',
        allegation:
          'O MPF acusou Lula de receber reformas pagas pelas construtoras OAS e Odebrecht e pelo pecuarista José Carlos Bumlai num sítio que ele frequentava, em troca de contratos da Petrobras.',
        role: 'Réu. Foi condenado em duas instâncias.',
        outcome: 'anulado',
        outcomeText:
          'Condenação anulada pelo STF pelos mesmos motivos do triplex. A denúncia reapresentada foi rejeitada: os crimes prescreveram e faltou prova válida.',
        timeline: [
          {
            date: '06/02/2019',
            body: '13ª Vara Federal de Curitiba',
            text: 'Condena Lula a 12 anos e 11 meses de prisão.',
            sources: [
              f(
                'Lula tem condenação mantida e pena aumentada para 17 anos no caso do sítio',
                'Poder360',
                'https://www.poder360.com.br/justica/lula-tem-condenacao-mantida-e-pena-aumentada-para-17-anos-no-caso-do-sitio/',
              ),
            ],
          },
          {
            date: '27/11/2019',
            body: 'TRF4 (2ª instância)',
            text: 'Mantém a condenação e aumenta a pena para 17 anos, 1 mês e 10 dias.',
            sources: [
              f(
                'Lula tem condenação mantida e pena aumentada para 17 anos no caso do sítio',
                'Poder360',
                'https://www.poder360.com.br/justica/lula-tem-condenacao-mantida-e-pena-aumentada-para-17-anos-no-caso-do-sitio/',
              ),
            ],
          },
          {
            date: '2021',
            body: 'STF',
            text: 'Anula a condenação, nas mesmas decisões do triplex (Curitiba sem competência e Moro parcial).',
            sources: [
              f(
                'Entenda a decisão do STF que anulou os processos contra Lula',
                'Dizer o Direito',
                'https://www.dizerodireito.com.br/2021/05/entenda-decisao-do-stf-que-anulou-os.html',
              ),
            ],
          },
          {
            date: '29/09/2021',
            body: 'Justiça Federal do DF',
            text: 'Rejeita a denúncia reapresentada: os crimes prescreveram e o MPF não indicou provas que continuassem válidas.',
            sources: [
              f(
                'Justiça do DF volta a negar denúncia contra Lula no caso do sítio de Atibaia',
                'Poder360',
                'https://www.poder360.com.br/justica/justica-do-df-volta-a-negar-denuncia-contra-lula-no-caso-do-sitio-de-atibaia/',
              ),
            ],
          },
        ],
        meaning:
          'Não há condenação válida nem absolvição: o caso terminou sem que a Justiça decidisse, num processo válido, se houve crime.',
      },
      {
        id: 'instituto',
        title: 'Instituto Lula: terreno e doações da Odebrecht',
        period: '2016–2023',
        group: 'pessoal',
        allegation:
          'O MPF acusou Lula de receber propina da Odebrecht na forma de um terreno para a sede do Instituto Lula e de doações ao instituto.',
        role: 'Réu nas duas ações, sem sentença.',
        outcome: 'arquivado',
        outcomeText:
          'Ações encerradas pelo STF em 2023, sem julgamento: as provas vindas dos sistemas da Odebrecht foram consideradas inválidas e faltou base para a acusação.',
        timeline: [
          {
            date: '2021',
            body: 'STF',
            text: 'Envia os casos de Curitiba para a Justiça Federal do DF, na decisão que anulou os processos da Lava Jato contra Lula.',
            sources: [
              f(
                'Restam a Lula três ações em tramitação na Justiça Federal',
                'Conjur',
                'https://conjur.com.br/2021-jun-21/restam-lula-tres-acoes-tramitacao-justica-federal/',
              ),
            ],
          },
          {
            date: '22/02/2023',
            body: 'STF (ministro Ricardo Lewandowski)',
            text: 'Encerra as ações por falta de base para a acusação: as provas dos sistemas da Odebrecht foram consideradas contaminadas.',
            sources: [
              f(
                'Lewandowski encerra três ações contra Lula que estavam suspensas',
                'Agência Brasil',
                'https://agenciabrasil.ebc.com.br/justica/noticia/2023-02/lewandowski-encerra-tres-acoes-contra-lula-que-estavam-suspensas',
              ),
            ],
          },
        ],
        meaning: 'O processo acabou sem julgamento de culpa. Não é absolvição nem condenação.',
      },
      {
        id: 'quadrilhao',
        title: '“Quadrilhão do PT”',
        period: '2017–2019',
        group: 'pessoal',
        allegation:
          'A Procuradoria-Geral da República acusou Lula, Dilma Rousseff e ex-ministros de formar uma organização criminosa para desviar dinheiro da Petrobras e de outros órgãos.',
        role: 'Réu.',
        outcome: 'absolvido',
        outcomeText:
          'Absolvido em 2019: a Justiça entendeu que a denúncia não mostrava uma organização criminosa. O próprio MPF pediu a absolvição.',
        timeline: [
          {
            date: '04/12/2019',
            body: '12ª Vara Federal do DF',
            text: 'Absolve sumariamente todos os réus, entre eles Lula e Dilma.',
            sources: [
              f(
                'Juiz absolve Lula, Dilma, Palocci e Mantega em ação do “quadrilhão do PT”',
                'Migalhas',
                'https://www.migalhas.com.br/quentes/316506/juiz-absolve-lula--dilma--palocci-e-mantega-em-acao-do--quadrilhao-do-pt',
              ),
            ],
          },
        ],
        meaning:
          'Afasta a acusação de organização criminosa. Os fatos avulsos citados na denúncia foram tratados em outros processos.',
      },
      {
        id: 'cervero',
        title: 'Obstrução de justiça (caso Cerveró)',
        period: '2016–2018',
        group: 'pessoal',
        allegation:
          'Com base na delação do ex-senador Delcídio do Amaral, o MPF acusou Lula de participar de um plano para comprar o silêncio do ex-diretor da Petrobras Nestor Cerveró.',
        role: 'Réu.',
        outcome: 'absolvido',
        outcomeText: 'Absolvido por falta de provas em 2018. O MPF também pediu a absolvição.',
        timeline: [
          {
            date: '12/07/2018',
            body: '10ª Vara Federal do DF',
            text: 'Absolve Lula e outros seis réus por falta de provas.',
            sources: [
              f(
                'Justiça do DF absolve Lula na Lava Jato',
                'Congresso em Foco',
                'https://www.congressoemfoco.com.br/noticia/39493/justica-do-df-absolve-lula-na-lava-jato',
              ),
            ],
          },
        ],
        meaning:
          'É absolvição de mérito: a Justiça analisou as provas e concluiu que não bastavam para condenar.',
      },
      {
        id: 'zelotes-mp471',
        title: 'Operação Zelotes: a MP das montadoras',
        period: '2017–2021',
        group: 'pessoal',
        allegation:
          'O MPF acusou Lula de aceitar a promessa de R$ 6 milhões para a campanha do PT em troca de uma medida provisória (MP 471/2009) que beneficiava montadoras.',
        role: 'Réu.',
        outcome: 'absolvido',
        outcomeText: 'Absolvido por falta de provas em 2021, a pedido do MPF.',
        timeline: [
          {
            date: '21/06/2021',
            body: '10ª Vara Federal do DF',
            text: 'Absolve Lula e os demais réus por falta de provas.',
            sources: [
              f(
                'Justiça Federal absolve Lula e mais seis em processo da Operação Zelotes',
                'Bahia Notícias',
                'https://www.bahianoticias.com.br/noticia/259908-justica-federal-absolve-lula-e-mais-seis-em-processo-no-ambito-da-operacao-zelotes',
              ),
            ],
          },
        ],
        meaning: 'É absolvição de mérito, por falta de provas.',
      },
      {
        id: 'zelotes-gripen',
        title: 'Operação Zelotes: caças Gripen',
        period: '2016–2023',
        group: 'pessoal',
        allegation:
          'O MPF acusou Lula de tráfico de influência e lavagem na compra de 36 caças suecos Gripen e numa medida provisória (MP 627), com pagamentos de lobistas à empresa de um filho dele.',
        role: 'Réu.',
        outcome: 'arquivado',
        outcomeText:
          'Ação encerrada pelo STF em 2023, sem julgamento, por falta de base para a acusação.',
        timeline: [
          {
            date: '03/2022',
            body: 'STF (ministro Ricardo Lewandowski)',
            text: 'Suspende a ação, citando mensagens que indicariam parcialidade de procuradores.',
            sources: [
              f(
                'Lewandowski suspende ação contra Lula sobre compra de caças Gripen',
                'IstoÉ',
                'https://istoe.com.br/lewandowski-do-stf-suspende-acao-contra-lula-por-crimes-em-compra-de-cacas-suecos-gripen',
              ),
            ],
          },
          {
            date: '22/02/2023',
            body: 'STF (ministro Ricardo Lewandowski)',
            text: 'Encerra a ação, na mesma decisão que encerrou os casos do Instituto Lula.',
            sources: [
              f(
                'Lewandowski encerra três ações contra Lula que estavam suspensas',
                'Agência Brasil',
                'https://agenciabrasil.ebc.com.br/justica/noticia/2023-02/lewandowski-encerra-tres-acoes-contra-lula-que-estavam-suspensas',
              ),
            ],
          },
        ],
        meaning: 'O processo acabou sem julgamento de culpa. Não é absolvição nem condenação.',
      },
      {
        id: 'bndes-angola',
        title: 'BNDES e obras em Angola',
        period: '2016–2021',
        group: 'pessoal',
        allegation:
          'Duas ações acusaram Lula de tráfico de influência, corrupção e lavagem em financiamentos do BNDES para obras da Odebrecht em Angola, incluindo pagamentos à empresa de um sobrinho dele.',
        role: 'Réu nas duas ações.',
        outcome: 'arquivado',
        outcomeText:
          'As duas ações foram encerradas sem julgamento: uma porque a denúncia não tinha base mínima, a outra porque se apoiava em provas anuladas.',
        timeline: [
          {
            date: '01/09/2020',
            body: 'TRF1 (2ª instância)',
            text: 'Encerra a primeira ação: a denúncia foi considerada sem indícios mínimos.',
            sources: [
              f(
                'Tribunal arquiva ação contra Lula na Justiça Federal em Brasília',
                'Poder360',
                'https://www.poder360.com.br/justica/tribunal-arquiva-acao-contra-lula-na-justica-federal-em-brasilia/',
              ),
            ],
          },
          {
            date: '03/09/2021',
            body: '10ª Vara Federal do DF',
            text: 'Encerra a segunda ação: ela se apoiava no caso do “quadrilhão”, em que houve absolvição, e em provas de Curitiba anuladas pelo STF.',
            sources: [
              f(
                'Juiz tranca ação contra Lula por suposta corrupção para favorecer a Odebrecht',
                'O Povo',
                'https://www.opovo.com.br/noticias/politica/2021/09/06/juiz-tranca-acao-contra-lula-por-suposta-corrupcao-para-favorecer-a-odebrecht.html',
              ),
            ],
          },
        ],
        meaning: 'Os processos acabaram sem julgamento de culpa. Não é absolvição nem condenação.',
      },
      {
        id: 'guine',
        title: 'Guiné Equatorial',
        period: '2018–2021',
        group: 'pessoal',
        allegation:
          'O MPF acusou Lula de lavagem de dinheiro: R$ 1 milhão doado ao Instituto Lula seria pagamento por influência a favor de uma empresa brasileira na Guiné Equatorial.',
        role: 'Réu.',
        outcome: 'arquivado',
        outcomeText:
          'Ação encerrada pelo TRF3 em 2021: as provas vinham de buscas autorizadas por Moro e foram consideradas contaminadas.',
        timeline: [
          {
            date: '12/2018',
            body: 'Justiça Federal de São Paulo',
            text: 'Recebe a denúncia, e Lula vira réu.',
            sources: [
              f(
                'Lula vira réu por lavagem de dinheiro em negócio na Guiné Equatorial',
                'Poder360',
                'https://www.poder360.com.br/justica/lula-vira-reu-por-lavagem-de-dinheiro-em-negocio-na-guine-equatorial/',
              ),
            ],
          },
          {
            date: '09/08/2021',
            body: 'TRF3 (2ª instância)',
            text: 'Encerra a ação, por unanimidade, por causa das provas contaminadas.',
            sources: [
              f(
                'TRF-3 tranca ação contra Lula por suposta lavagem de dinheiro',
                'Poder360',
                'https://www.poder360.com.br/justica/trf-3-tranca-acao-contra-lula-por-suposta-lavagem-de-dinheiro/',
              ),
            ],
          },
        ],
        meaning:
          'A ação acabou pela origem ilegal das provas, não por um julgamento sobre o mérito.',
      },
      {
        id: 'frei-chico',
        title: '“Mesada” da Odebrecht ao irmão',
        period: '2019–2020',
        group: 'pessoal',
        allegation:
          'A Lava Jato de São Paulo acusou Lula de saber de pagamentos de R$ 1,13 milhão da Odebrecht ao irmão dele, Frei Chico, entre 2003 e 2015.',
        role: 'Denunciado. Não chegou a virar réu.',
        outcome: 'rejeitado',
        outcomeText:
          'Denúncia rejeitada em 2019 por falta de base mínima. O TRF3 manteve a rejeição em 2020.',
        timeline: [
          {
            date: '16/09/2019',
            body: '7ª Vara Federal Criminal de São Paulo',
            text: 'Rejeita a denúncia por falta de justa causa.',
            sources: [
              f(
                'Por unanimidade, TRF-3 rejeita denúncia da Lava Jato contra Lula e Frei Chico',
                'Jornal de Brasília',
                'https://jornaldebrasilia.com.br/noticias/politica-e-poder/por-unanimidade-trf-3-rejeita-denuncia-da-lava-jato-contra-lula-e-frei-chico/',
              ),
            ],
          },
          {
            date: '05/2020',
            body: 'TRF3 (2ª instância)',
            text: 'Mantém a rejeição, por unanimidade.',
            sources: [
              f(
                'Por unanimidade, TRF-3 rejeita denúncia da Lava Jato contra Lula e Frei Chico',
                'Jornal de Brasília',
                'https://jornaldebrasilia.com.br/noticias/politica-e-poder/por-unanimidade-trf-3-rejeita-denuncia-da-lava-jato-contra-lula-e-frei-chico/',
              ),
            ],
          },
        ],
        meaning:
          'A Justiça não chegou a abrir o processo: entendeu que a acusação não tinha base suficiente.',
      },
      {
        id: 'mensalao',
        title: 'Mensalão',
        period: '2005–2017',
        group: 'entorno',
        allegation:
          'Pagamentos a deputados da base do governo com dinheiro operado pelo publicitário Marcos Valério. Em 2012, o STF condenou ex-ministros e dirigentes partidários, entre eles José Dirceu.',
        role: 'Não foi denunciado. Foi investigado num inquérito derivado, sobre um suposto repasse da Portugal Telecom, sem denúncia.',
        outcome: 'sem-acusacao',
        outcomeText:
          'Sem acusação contra Lula. O inquérito derivado foi arquivado em 2015 e reaberto em 2017; o site não localizou o desfecho.',
        timeline: [
          {
            date: '09/2015',
            body: 'Procuradoria da República no DF',
            text: 'Arquiva o último inquérito sobre Lula ligado ao mensalão, por não conseguir comprovar o relato de Marcos Valério.',
            sources: [
              f(
                'MPF arquiva último inquérito sobre Lula no mensalão',
                'Jornal do Brasil',
                'https://www.jb.com.br/pais/noticias/2015/09/26/mpf-arquiva-ultimo-inquerito-sobre-lula-no-mensalao.html',
              ),
            ],
          },
          {
            date: '08/2017',
            body: 'MPF (Câmara de Combate à Corrupção)',
            text: 'Reabre o inquérito.',
            sources: [
              f(
                'MPF desarquiva inquérito contra Lula ligado ao mensalão',
                'Agência Brasil',
                'https://agenciabrasil.ebc.com.br/politica/noticia/2017-08/mpf-desarquiva-inquerito-contra-lula-ligado-ao-mensalao',
              ),
            ],
          },
        ],
        meaning:
          'Sem acusação formal, não há decisão da Justiça sobre a responsabilidade dele, nem para culpar nem para inocentar.',
      },
      {
        id: 'master',
        title: 'Encontro com o dono do Banco Master',
        period: '2024–2026',
        group: 'entorno',
        allegation:
          'Lula recebeu Daniel Vorcaro, dono do Banco Master, no Palácio do Planalto em 4 de dezembro de 2024, num encontro levado pelo ex-ministro Guido Mantega e sem registro na agenda oficial. Em novembro de 2025, o Banco Central liquidou o banco, e a PF prendeu Vorcaro. Mensagens apreendidas com ele citam o presidente.',
        role: 'Não é investigado.',
        outcome: 'sem-acusacao',
        outcomeText: 'Sem acusação contra Lula. A investigação sobre o banco segue no STF.',
        timeline: [
          {
            date: '04/12/2024',
            body: 'Palácio do Planalto',
            text: 'Lula recebe Vorcaro, com ministros e o futuro presidente do Banco Central, Gabriel Galípolo. O encontro não aparece na agenda oficial.',
            sources: [
              f(
                'Lula recebeu Vorcaro, dono do Master, sem registro na agenda',
                'Poder360',
                'https://www.poder360.com.br/poder-governo/lula-recebeu-vorcaro-dono-do-master-sem-registro-na-agenda/',
              ),
            ],
          },
          {
            date: '18/11/2025',
            body: 'Banco Central e Polícia Federal',
            text: 'O Banco Central decreta a liquidação do Banco Master, e a PF prende Vorcaro na Operação Compliance Zero.',
            sources: [
              f(
                'Banco Central decreta liquidação extrajudicial do Banco Master',
                'Migalhas',
                'https://www.migalhas.com.br/quentes/444659/banco-central-decreta-liquidacao-extrajudicial-do-banco-master',
              ),
            ],
          },
          {
            date: '21/09/2026',
            body: 'Aos Fatos (checagem)',
            text: 'Os documentos públicos do caso citam Lula em três situações, entre elas o encontro de 2024. Nenhuma trata de pagamento a ele.',
            sources: [
              f(
                'Documentos do caso Master não mostram repasse de R$ 300 milhões de Vorcaro a Lula',
                'Aos Fatos',
                'https://www.aosfatos.org/noticias/documentos-lula-300-milhoes-vorcaro/',
              ),
            ],
          },
        ],
        meaning:
          'Sem acusação formal, não há decisão da Justiça sobre a responsabilidade dele, nem para culpar nem para inocentar.',
      },
      {
        id: 'inss',
        title: 'Descontos indevidos no INSS',
        period: '2025–2026',
        group: 'entorno',
        allegation:
          'Entidades descontaram mensalidades sem autorização de aposentados e pensionistas entre 2019 e 2024, nos governos Bolsonaro e Lula. O prejuízo estimado é de R$ 6,3 bilhões. O filho de Lula, Fábio Luís (Lulinha), passou a ser investigado em 2026.',
        role: 'Lula não é investigado. Lulinha é investigado em três inquéritos no STF, sem denúncia.',
        outcome: 'sem-acusacao',
        outcomeText:
          'Investigações em andamento contra terceiros, entre eles o filho. Nenhuma acusação contra Lula.',
        timeline: [
          {
            date: '23/04/2025',
            body: 'Polícia Federal e CGU',
            text: 'Deflagram a Operação Sem Desconto. O presidente do INSS é afastado.',
            sources: [
              f(
                'Entenda a operação da PF que mira o presidente do INSS',
                'Poder360',
                'https://www.poder360.com.br/poder-governo/entenda-a-operacao-da-pf-que-mira-presidente-do-inss/',
              ),
            ],
          },
          {
            date: '28/03/2026',
            body: 'CPMI do INSS (Congresso)',
            text: 'Termina sem relatório aprovado: o texto do relator, que pedia o indiciamento de 216 pessoas, entre elas Lulinha, foi rejeitado por 19 a 12.',
            sources: [
              f(
                'CPMI do INSS termina sem relatório final',
                'Agência Brasil',
                'https://agenciabrasil.ebc.com.br/politica/noticia/2026-03/cpmi-do-inss-termina-sem-relatorio-final',
              ),
            ],
          },
          {
            date: '30/07 a 04/08/2026',
            body: 'STF (ministros André Mendonça e Flávio Dino)',
            text: 'Autorizam três inquéritos sobre Lulinha: suspeitas de tráfico de influência e corrupção em favor de empresas junto ao governo.',
            sources: [
              f(
                'Entenda os três inquéritos em que Lulinha é investigado',
                'CNN Brasil',
                'https://www.cnnbrasil.com.br/politica/entenda-os-tres-inqueritos-em-que-lulinha-e-investigado/',
              ),
            ],
          },
          {
            date: '02/10/2026',
            body: 'Polícia Federal',
            text: 'Pede mais prazo para concluir as análises dos inquéritos que citam Lulinha. Até 21/10/2026, o pedido não tinha sido decidido.',
            sources: [
              f(
                'PF pede mais prazo para concluir análises nos inquéritos que citam Lulinha',
                'Diário de Pernambuco',
                'https://www.diariodepernambuco.com.br/politica/2026/10/11727131-pf-pede-mais-prazo-para-concluir-analises-nos-inqueritos-que-citam-lulinha.html',
              ),
            ],
          },
        ],
        meaning:
          'Sem acusação formal, não há decisão da Justiça sobre a responsabilidade dele, nem para culpar nem para inocentar. O filho é investigado, sem denúncia; o pedido de indiciamento da CPMI não tem efeito, porque o relatório foi rejeitado.',
      },
    ],
  },
  {
    id: 'flavio',
    cases: [
      {
        id: 'rachadinha',
        title: 'Rachadinha na Alerj (caso Queiroz)',
        period: '2018–2025',
        group: 'pessoal',
        allegation:
          'O Ministério Público do Rio acusou Flávio de comandar um esquema em que funcionários do gabinete dele na Assembleia do Rio devolviam parte do salário, operado pelo ex-assessor Fabrício Queiroz. Segundo a denúncia, o dinheiro foi lavado numa loja de chocolates da qual ele era sócio e na compra de imóveis.',
        role: 'Denunciado por peculato, lavagem de dinheiro, apropriação indébita e organização criminosa. Não chegou a virar réu.',
        outcome: 'rejeitado',
        outcomeText:
          'Denúncia rejeitada em 2022 porque as provas que a sustentavam foram anuladas pelo STJ. O STF manteve o arquivamento em 2025.',
        timeline: [
          {
            date: '25/06/2020',
            body: 'TJ-RJ (3ª Câmara Criminal)',
            text: 'Tira o caso do juiz de 1ª instância e manda para o Órgão Especial do tribunal, por causa do foro de deputado.',
            sources: [
              f(
                'Rachadinha: TJ-RJ decidirá na 2ª instância caso de Flávio Bolsonaro',
                'Congresso em Foco',
                'https://www.congressoemfoco.com.br/legislativo/rachadinha-tj-rj-decidira-na-2a-competencia-de-caso-de-flavio-bolsonaro/',
              ),
            ],
          },
          {
            date: '19/10/2020',
            body: 'Ministério Público do Rio',
            text: 'Denuncia Flávio, Queiroz e mais 15 pessoas.',
            sources: [
              f(
                'MP denuncia Flávio Bolsonaro por esquema de rachadinha na Alerj',
                'Conjur',
                'https://www.conjur.com.br/2020-nov-04/mp-denuncia-flavio-bolsonaro-esquema-rachadinha-alerj/',
              ),
            ],
          },
          {
            date: '23/02/2021',
            body: 'STJ (5ª Turma)',
            text: 'Anula, por 4 a 1, as quebras de sigilo bancário e fiscal, por falta de fundamentação.',
            sources: [
              f(
                'PGR recorre de decisão do STJ que anulou quebra de sigilo de Flávio Bolsonaro',
                'Poder360',
                'https://www.poder360.com.br/justica/pgr-recorre-de-decisao-do-stj-que-anulou-quebra-de-sigilo-de-flavio-bolsonaro/',
              ),
            ],
          },
          {
            date: '09/11/2021',
            body: 'STJ (5ª Turma)',
            text: 'Anula todas as decisões do juiz de 1ª instância no caso, por ele não ter competência para julgá-lo.',
            sources: [
              f(
                'STJ anula decisões contra Flávio Bolsonaro em processo sobre rachadinhas',
                'Congresso em Foco',
                'https://www.congressoemfoco.com.br/artigo/30315/stj-anula-decisoes-contra-flavio-bolsonaro-em-processo-sobre-rachadinhas',
              ),
            ],
          },
          {
            date: '16/05/2022',
            body: 'TJ-RJ (Órgão Especial)',
            text: 'Rejeita a denúncia por unanimidade, a pedido do próprio MP, porque ela se apoiava em provas anuladas.',
            sources: [
              f(
                'Justiça do Rio arquiva processo de caso de supostas rachadinhas',
                'Agência Brasil',
                'https://agenciabrasil.ebc.com.br/politica/noticia/2022-05/justica-do-rio-arquiva-processo-de-caso-de-supostas-rachadinhas',
              ),
            ],
          },
          {
            date: '26/02/2025',
            body: 'STF (ministro Gilmar Mendes)',
            text: 'Nega os recursos do MP do Rio e mantém o arquivamento. Registra que nada impede uma nova denúncia.',
            sources: [
              f(
                'Gilmar nega recursos e mantém arquivado caso das rachadinhas de Flávio Bolsonaro',
                'InfoMoney',
                'https://www.infomoney.com.br/politica/gilmar-nega-recursos-e-mantem-arquivado-caso-das-rachadinhas-de-flavio-bolsonaro/',
              ),
            ],
          },
        ],
        meaning:
          'O mérito (se houve ou não o esquema) nunca foi julgado. Prova anulada não é absolvição nem declaração de inocência, e o STF registrou que o MP pode apresentar nova denúncia com provas independentes.',
      },
      {
        id: 'dark-horse',
        title: 'Filme “Dark Horse” e Banco Master',
        period: '2025–2026',
        group: 'pessoal',
        allegation:
          'A Polícia Federal apura se o dono do Banco Master, Daniel Vorcaro, enviou cerca de R$ 61 milhões para o filme sobre Jair Bolsonaro a pedido de Flávio, e se houve lavagem de dinheiro, evasão de divisas e corrupção.',
        role: 'Investigado no STF desde julho de 2026.',
        outcome: 'andamento',
        outcomeText: 'Investigação em andamento, sem indiciamento nem denúncia.',
        timeline: [
          {
            date: '13/05/2026',
            body: 'The Intercept Brasil',
            text: 'Publica áudio de Flávio cobrando recursos de Vorcaro para o filme. Flávio confirma o contato.',
            sources: [
              f(
                'Flávio Bolsonaro: áudio vazado com Vorcaro',
                'Agência Pública',
                'https://apublica.org/nota/flavio-bolsonaro-audio-vazado-com-vorcaro-cobra-r-134-milhoes/',
              ),
            ],
          },
          {
            date: '22/07/2026',
            body: 'STF (ministro André Mendonça)',
            text: 'Inclui Flávio como investigado, a pedido da PF e com aval da Procuradoria-Geral da República.',
            sources: [
              f(
                'Mendonça incluiu Flávio Bolsonaro como investigado no caso Dark Horse',
                'Agência Brasil',
                'https://agenciabrasil.ebc.com.br/justica/noticia/2026-09/mendonca-incluiu-flavio-bolsonaro-como-investigado-no-caso-dark-horse',
              ),
            ],
          },
          {
            date: '10/09/2026',
            body: 'STF',
            text: 'Retira o sigilo do caso. O relatório da PF com as conversas entre Flávio e Vorcaro se torna público.',
            sources: [
              f(
                'PF mostra conversas de Flávio com Vorcaro sobre recursos para Dark Horse',
                'CNN Brasil',
                'https://www.cnnbrasil.com.br/politica/pf-mostra-conversas-de-flavio-com-vorcaro-sobre-recursos-para-dark-horse/',
              ),
            ],
          },
          {
            date: '15/10/2026',
            body: 'Polícia Federal',
            text: 'Pede ao STF mais 90 dias e entrega documentos que, segundo a PF, mostram uma “divergência contábil severa”: mais de US$ 12 milhões saíram do país e US$ 2,8 milhões voltaram. Até 21/10/2026, o pedido não tinha sido decidido.',
            sources: [
              f(
                'Dark Horse: PF pede mais 90 dias para investigação sobre filme de Bolsonaro',
                'Metrópoles',
                'https://www.metropoles.com/colunas/manoela-alcantara/dark-horse-pf-pede-mais-90-dias-para-investigacao-sobre-filme-de-bolsonaro',
              ),
              f(
                '“Dark Horse”: PF aponta divergência “severa” entre recursos enviados ao exterior',
                'O Povo',
                'https://opovo.com.br/noticias/brasil/2026/10/20/quotdark-horse-quot-pf-aponta-divergencia-quotsevera-quot-entre-recursos-enviados-ao-exterior.html',
              ),
            ],
          },
        ],
        meaning:
          'O STF autorizou investigar porque viu indícios que justificam a apuração. Isso não é acusação nem juízo de culpa.',
      },
      {
        id: 'willer-tomaz',
        title: 'Caso Willer Tomaz',
        period: '2025–2026',
        group: 'pessoal',
        allegation:
          'A PF enviou ao STF uma apuração sobre lavagem de dinheiro ligada ao advogado Willer Tomaz, amigo de Flávio, cuja conta movimentou cerca de R$ 130 milhões em 2025. Segundo a PF, e-mails indicam que Flávio foi cadastrado como “usuário master” de uma conta de empresa do advogado.',
        role: 'Citado na apuração. Não há confirmação oficial de que foi aberto inquérito contra ele.',
        outcome: 'andamento',
        outcomeText:
          'Apuração no STF, sob sigilo, com o ministro Alexandre de Moraes. A campanha diz que ainda não virou inquérito.',
        timeline: [
          {
            date: '08/10/2026',
            body: 'Polícia Federal',
            text: 'Envia ao STF a apuração iniciada na Justiça Federal do Rio Grande do Sul, por causa do foro de senador de Flávio.',
            sources: [
              f(
                'PF envia ao STF nova investigação sobre Flávio, segundo jornal',
                'Poder360',
                'https://www.poder360.com.br/poder-justica/pf-envia-ao-stf-nova-investigacao-sobre-flavio-segundo-jornal/',
              ),
            ],
          },
          {
            date: '20/10/2026',
            body: 'Defesa de Flávio',
            text: 'Pede a Alexandre de Moraes acesso aos autos.',
            sources: [
              f(
                'Flávio pede a Moraes acesso a investigação que preocupa campanha',
                'CNN Brasil',
                'https://www.cnnbrasil.com.br/blogs/caio-junqueira/eleicoes/flavio-pede-a-moraes-acesso-a-investigacao-que-preocupa-campanha/',
              ),
            ],
          },
        ],
        meaning:
          'É uma apuração em fase inicial e sob sigilo, sem indiciamento. Isso não é acusação nem juízo de culpa.',
      },
      {
        id: 'declaracao-bens',
        title: 'Declaração de bens e negócios com imóveis',
        period: '2018–2023',
        group: 'pessoal',
        allegation:
          'Inquéritos na Justiça Eleitoral apuraram se Flávio declarou valores falsos de imóveis ao se candidatar (2014, 2016 e 2018) e se houve lavagem de dinheiro em negócios imobiliários.',
        role: 'Investigado.',
        outcome: 'arquivado',
        outcomeText:
          'A PF não encontrou indícios de crime. O TRE-RJ arquivou em 2023 a apuração que ainda estava aberta, porque a investigação passou do prazo razoável.',
        timeline: [
          {
            date: '03/02/2020',
            body: 'Polícia Federal',
            text: 'Conclui que não há indícios de lavagem de dinheiro nem de falsidade ideológica na declaração de bens de 2018.',
            sources: [
              f(
                'PF não vê indícios e livra Flávio Bolsonaro de dois crimes',
                'Congresso em Foco',
                'https://www.congressoemfoco.com.br/noticia/38598/pf-nao-ve-indicios-e-livra-flavio-bolsonaro-de-dois-crimes',
              ),
            ],
          },
          {
            date: '23/05/2023',
            body: 'TRE-RJ',
            text: 'Arquiva por unanimidade o inquérito sobre as declarações de 2014 e 2016. O Ministério Público Eleitoral já tinha pedido o arquivamento.',
            sources: [
              f(
                'TRE-RJ arquiva inquérito contra Flávio Bolsonaro por falsidade ideológica',
                'Estado de Minas',
                'https://www.em.com.br/app/noticia/politica/2023/05/23/interna_politica,1497726/amp.html',
              ),
            ],
          },
        ],
        meaning:
          'Os investigadores não encontraram indícios de crime, e não houve acusação. O arquivamento não chegou a julgar o mérito.',
      },
      {
        id: 'brb',
        title: 'Empréstimo do BRB para a casa em Brasília',
        period: '2021–2026',
        group: 'entorno',
        allegation:
          'Em 2021, Flávio comprou uma casa de R$ 6 milhões em Brasília com R$ 3,1 milhões financiados pelo BRB, banco público do Distrito Federal, com juros abaixo da média do banco. O empréstimo foi quitado em 2024.',
        role: 'Não é acusado. Houve apuração sobre o empréstimo, não sobre ele.',
        outcome: 'sem-acusacao',
        outcomeText:
          'Sem acusação contra Flávio. O site não localizou o desfecho da apuração de 2021. Em 2026, a PF passou a examinar o contrato dentro da investigação sobre o Banco Master.',
        timeline: [
          {
            date: '18/03/2021',
            body: 'Ministério Público do DF',
            text: 'Abre procedimento para apurar a concessão do empréstimo.',
            sources: [
              f(
                'MP investiga empréstimo do BRB para Flávio Bolsonaro comprar mansão',
                'Poder360',
                'https://www.poder360.com.br/congresso/mp-investiga-emprestimo-do-brb-para-flavio-bolsonaro-comprar-mansao/',
              ),
            ],
          },
          {
            date: '10/2026',
            body: 'Polícia Federal',
            text: 'Passa a apurar se houve favorecimento no empréstimo, com base numa auditoria do próprio BRB.',
            sources: [
              f(
                'PF investiga financiamento de mansão de Flávio Bolsonaro em Brasília',
                'Jornal do Brasil',
                'https://www.jb.com.br/brasil/policia/2026/10/1061098-pf-investiga-financiamento-de-mansao-de-flavio-bolsonaro-em-brasilia.html',
              ),
            ],
          },
        ],
        meaning:
          'Sem acusação formal, não há decisão da Justiça sobre a responsabilidade dele, nem para culpar nem para inocentar. Nenhuma fonte oficial nomeia Flávio como investigado na apuração aberta pela PF em 2026.',
      },
      {
        id: 'abin',
        title: '“Abin paralela” e a defesa na rachadinha',
        period: '2020–2025',
        group: 'entorno',
        allegation:
          'A Polícia Federal concluiu que a Abin, no governo Bolsonaro, produziu relatórios para ajudar a defesa de Flávio no caso da rachadinha e monitorou auditores da Receita ligados ao caso.',
        role: 'Não foi indiciado. A PF o cita como beneficiário.',
        outcome: 'sem-acusacao',
        outcomeText:
          'O relatório final da PF, de 2025, indiciou 35 pessoas. Flávio não está entre elas.',
        timeline: [
          {
            date: '07/2024',
            body: 'Polícia Federal',
            text: 'Revela relatórios da Abin e o áudio de uma reunião no Planalto, em 2020, sobre como “blindar” Flávio.',
            sources: [
              f(
                '“Manter fechadíssimo”, diz Augusto Heleno sobre plano para blindar Flávio Bolsonaro',
                'Correio Braziliense',
                'https://www.correiobraziliense.com.br/politica/2024/07/6898965-manter-fechadissimo-diz-augusto-heleno-sobre-plano-para-blindar-flavio-bolsonaro.html',
              ),
            ],
          },
          {
            date: '12/06/2025',
            body: 'Polícia Federal',
            text: 'Entrega ao STF o relatório final, com 35 indiciados. Flávio não está na lista.',
            sources: [
              f(
                'Leia a íntegra do relatório final da Abin paralela',
                'Poder360',
                'https://www.poder360.com.br/poder-justica/leia-a-integra-do-relatorio-final-da-abin-paralela/',
              ),
            ],
          },
        ],
        meaning:
          'Sem acusação formal, não há decisão da Justiça sobre a responsabilidade dele, nem para culpar nem para inocentar.',
      },
      {
        id: 'adriano',
        title: 'Homenagens e empregos ligados a Adriano da Nóbrega',
        period: '2003–2020',
        group: 'entorno',
        allegation:
          'Como deputado estadual, Flávio homenageou o ex-policial Adriano da Nóbrega em 2003 e 2005; na segunda vez, Adriano estava preso, acusado de homicídio. A mãe e a ex-mulher de Adriano trabalharam no gabinete dele até 2018. Adriano foi apontado como chefe de milícia e morreu numa operação policial em 2020.',
        role: 'Não é acusado de ligação com milícia. As contratações entraram apenas na investigação da rachadinha.',
        outcome: 'sem-acusacao',
        outcomeText: 'Sem acusação formal.',
        timeline: [
          {
            date: '2005',
            body: 'Assembleia Legislativa do Rio',
            text: 'Flávio concede a Medalha Tiradentes a Adriano.',
            sources: [
              f(
                'Bolsonaro diz que Adriano da Nóbrega era herói quando foi homenageado',
                'Poder360',
                'https://www.poder360.com.br/governo/bolsonaro-diz-que-adriano-da-nobrega-era-1-heroi-quando-foi-homenageado/',
              ),
            ],
          },
          {
            date: '02/2020',
            body: 'Polícia da Bahia',
            text: 'Adriano morre numa operação policial.',
            sources: [
              f(
                'Flávio Bolsonaro diz que Adriano era inocente quando o homenageou',
                'Metrópoles',
                'https://www.metropoles.com/brasil/politica-br/flavio-bolsonaro-diz-que-adriano-era-inocente-quando-o-homenageou',
              ),
            ],
          },
        ],
        meaning:
          'Sem acusação formal, não há decisão da Justiça sobre a responsabilidade dele, nem para culpar nem para inocentar.',
      },
    ],
  },
];

/** Boatos que circularam sobre cada um e foram desmentidos por agências de checagem. */
export const CASE_RUMORS: Record<
  'lula' | 'flavio',
  { text: string; verdict: string; sources: ReturnType<typeof f>[] }[]
> = {
  lula: [
    {
      text: '“Lula gastou R$ 7 bilhões em viagens.”',
      verdict:
        'Falso. O valor é o gasto com viagens de todo o governo federal em 2023–2025; a Presidência gastou R$ 150,5 milhões.',
      sources: [
        f(
          'Lula não gastou R$ 7 bilhões em viagens',
          'Aos Fatos',
          'https://www.aosfatos.org/noticias/lula-7-bilhoes-viagens/',
        ),
      ],
    },
    {
      text: '“Documentos do caso Master mostram repasse de R$ 300 milhões de Vorcaro a Lula.”',
      verdict:
        'Falso. Os documentos públicos citam Lula em três situações, e nenhuma trata de pagamento. O STF e a Secom também desmentiram.',
      sources: [
        f(
          'Documentos do caso Master não mostram repasse de R$ 300 milhões de Vorcaro a Lula',
          'Aos Fatos',
          'https://www.aosfatos.org/noticias/documentos-lula-300-milhoes-vorcaro/',
        ),
      ],
    },
    {
      text: '“Lula foi inocentado pelo STF.”',
      verdict:
        'Falso. O STF anulou as condenações por um problema de competência do juiz, sem julgar se ele era culpado ou inocente.',
      sources: [
        f(
          'É falso que Lula foi inocentado pelo STF',
          'AFP Checamos (via Estado de Minas)',
          'https://www.em.com.br/app/noticia/internacional/factcheck/2021/03/10/interna_internacional,1245327/amp.html',
        ),
      ],
    },
  ],
  flavio: [
    {
      text: '“Flávio teve a prisão decretada pelo STF.”',
      verdict: 'Falso. Nenhum órgão anunciou mandado de prisão contra ele.',
      sources: [
        f(
          'É falso que Flávio Bolsonaro teve prisão decretada',
          'Agência Lupa',
          'https://www.agencialupa.org/noticias/2026/06/26/falso-prisao-flavio-bolsonaro/',
        ),
      ],
    },
    {
      text: 'Foto de Flávio ao lado de Vorcaro e do “Careca do INSS”.',
      verdict: 'Falso. A imagem foi gerada por inteligência artificial.',
      sources: [
        f(
          'Imagem com Vorcaro, Careca do INSS e Flávio Bolsonaro foi gerada por IA',
          'Agência Lupa',
          'https://www.agencialupa.org/noticias/2026/03/09/imagem-com-vorcaro-careca-do-inss-e-flavio-bolsonaro-foi-gerada-por-ia/',
        ),
      ],
    },
    {
      text: '“Reportagem da CNN sobre apreensão de R$ 27 milhões em compra de votos envolve Flávio.”',
      verdict: 'Falso. A reportagem não cita Flávio.',
      sources: [
        f(
          'Reportagem da CNN Brasil sobre compra de votos não cita Flávio Bolsonaro',
          'Agência Lupa',
          'https://www.agencialupa.org/verificacao/2026/10/19/reportagem-da-cnn-brasil-sobre-compra-de-votos-nao-cita-flavio-bolsonaro/',
        ),
      ],
    },
  ],
};

/** A posição de cada candidato sobre as acusações, nas palavras dele, com a data da fala. */
export const CASE_DEFENSES: Record<
  'lula' | 'flavio',
  { text: string; sources: ReturnType<typeof f>[] }
> = {
  lula: {
    text: 'Lula nega as acusações. Depois da anulação das condenações, disse ter sido “vítima da maior mentira jurídica contada em 500 anos de história” (10/03/2021).',
    sources: [
      f(
        'Lula após decisão do STF: “fui vítima da maior mentira jurídica contada em 500 anos de história”',
        'Diário do Nordeste',
        'https://diariodonordeste.verdesmares.com.br/politica/lula-apos-decisao-do-stf-fui-vitima-da-maior-mentira-juridica-contada-em-500-anos-de-historia-1.3058112',
      ),
    ],
  },
  flavio: {
    text: 'Flávio nega irregularidades. Sobre a relação com Vorcaro, disse que “não teve absolutamente nada de errado” e que há “muita gente incomodada” com a candidatura dele (22/07/2026).',
    sources: [
      f(
        'Flávio nega irregularidade em contrato com empresa de Daniel Vorcaro',
        'Congresso em Foco',
        'https://www.congressoemfoco.com.br/noticia/120693/flavio-nega-irregularidade-em-contrato-com-empresa-de-daniel-vorcaro',
      ),
    ],
  },
};

/** Cuidados para ler esta parte sem tirar conclusão errada. */
export const CASE_READING = [
  'Entram os casos em que o candidato foi investigado, denunciado ou processado, e os casos com investigação oficial que envolveram o governo, o gabinete ou a família dele. Acusação sem investigação oficial fica de fora.',
  'Hoje, nenhum dos dois tem condenação em vigor.',
  'O número de casos não mede culpa nem inocência. Ele depende também do tempo de vida pública, dos cargos ocupados e de operações que abrem várias ações de uma vez.',
  'Condenação anulada, denúncia rejeitada e caso encerrado sem julgamento não querem dizer inocente nem culpado: nesses casos, a Justiça não decidiu se houve crime.',
  'Os casos de 2026 ainda estão mudando. As datas mostram até onde o site conferiu.',
  'Ficaram de fora as disputas da campanha de 2026 na Justiça Eleitoral, como multas por propaganda, porque não tratam de corrupção.',
];
