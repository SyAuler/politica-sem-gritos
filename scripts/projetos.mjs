// Baixa das bases oficiais todos os projetos de cada candidato e grava em
// public/dados/projetos-<id>.json, lidos pelas páginas /candidato/<id>/projetos.
//
//   node scripts/projetos.mjs            (usa a pasta temporária do sistema como cache)
//   node scripts/projetos.mjs D:\cache   (outra pasta de cache)
//
// Fontes: dados abertos do Senado (autorias e relatorias do Flávio), a lista dele na Alerj
// (scripts/dados/alerj-flavio.json, gerada por scripts/alerj_flavio.py) e dados da Câmara
// (projetos do Lula como deputado e tudo o que o Poder Executivo enviou nos governos
// dele; as medidas provisórias vêm do Senado, que registra a lei gerada por cada uma). Os arquivos anuais da Câmara são grandes (até ~50 MB): ficam no cache.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CACHE = process.argv[2] ?? join(tmpdir(), 'politica-sem-gritos-cache');
const OUT = join(import.meta.dirname, '..', 'public', 'dados');
const HOJE = new Date().toISOString().slice(0, 10);
mkdirSync(CACHE, { recursive: true });
mkdirSync(OUT, { recursive: true });

const SENADO = 'https://legis.senado.leg.br/dadosabertos';
const CAMARA = 'https://dadosabertos.camara.leg.br/api/v2';
const CAMARA_ARQ = 'https://dadosabertos.camara.leg.br/arquivos/proposicoes/json';
const FLAVIO_SENADO = 5894;
const LULA_CAMARA = 139289;

/** Tipos que são projeto (ficam de fora requerimentos, pareceres, indicações etc.). */
const TIPOS_PROJETO = new Set(['PL', 'PLS', 'PLP', 'PEC', 'PDL', 'PDC', 'PRS', 'PRC', 'MPV']);

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tentativas = 5) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (res.ok) return await res.json();
      if (i >= tentativas || (res.status < 500 && res.status !== 429)) {
        throw new Error(`${res.status} em ${url}`);
      }
    } catch (e) {
      if (i >= tentativas) throw e;
    }
    await espera(1500 * i);
  }
}

/** Baixa uma vez e guarda no cache (arquivos grandes da Câmara, detalhes do Senado). */
async function cacheado(nome, url) {
  const arq = join(CACHE, nome);
  if (existsSync(arq)) return JSON.parse(readFileSync(arq, 'utf8'));
  const dados = await getJson(url);
  writeFileSync(arq, JSON.stringify(dados));
  return dados;
}

/** Ementa oficial limpa; as antigas vêm em CAIXA ALTA e passam para frase normal. */
function ementa(texto) {
  let t = (texto ?? '').replace(/\s+/g, ' ').trim();
  // quando o Congresso muda o texto, a ementa traz a original e a "NOVA EMENTA": fica a final
  const nova = t.search(/NOVA EMENTA\s*:/i);
  if (nova >= 0) t = t.slice(nova).replace(/^NOVA EMENTA\s*:\s*/i, '');
  const letras = t.replace(/[^A-Za-zÀ-ú]/g, '');
  if (letras && letras === letras.toUpperCase()) {
    const original = t;
    t = t.toLowerCase().replace(/(^|[.!?]\s+)(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
    // siglas voltam a ser maiúsculas: as conhecidas e as explicadas no texto ("– CMPV", "(UERJ)")
    const siglas = new Set([
      ...SIGLAS,
      ...[...original.matchAll(/(?:[–-]\s*|\()([A-ZÀ-Ú]{2,8})\b/g)].map((m) => m[1]),
    ]);
    t = t.replace(/\p{L}+/gu, (w) => (siglas.has(w.toUpperCase()) ? w.toUpperCase() : w));
    t = t.replace(/\brio de janeiro\b/gi, 'Rio de Janeiro').replace(/\bbrasil\b/g, 'Brasil');
  }
  return t;
}

/** Siglas comuns nas ementas antigas, que ficam em maiúsculas. */
const SIGLAS = [
  'RJ',
  'UERJ',
  'UENF',
  'UEZO',
  'FAETEC',
  'FAPERJ',
  'CEDAE',
  'DETRAN',
  'PM',
  'PMERJ',
  'CBMERJ',
  'SUS',
  'ICMS',
  'IPVA',
  'ITD',
  'CNH',
  'ALERJ',
  'OAB',
  'ONG',
  'PROCON',
  'DEGASE',
  'SEAP',
  'TCE',
  'BRT',
  'VLT',
  'HIV',
  'AIDS',
  'CPF',
  'CNPJ',
  'INSS',
  'FGTS',
  'CLT',
  'MEC',
  'IBGE',
  'BNDES',
  'PIS',
  'PASEP',
  'IPI',
  'IR',
  'IOF',
  'SFH',
  'BNH',
  'CEF',
  'PETROBRAS',
  'ONU',
  'STF',
  'STJ',
  'TSE',
];

/**
 * Situação em quatro grupos, com o texto oficial guardado junto:
 * lei (virou norma), tramitando, parado (arquivado, rejeitado, perdeu a validade...)
 * e retirado (o próprio autor desistiu).
 */
function situacao(texto, temNorma, emTramitacao) {
  const t = (texto ?? '').toUpperCase();
  if (temNorma || /NORMA JUR|PROMULGAD|SANCIONAD/.test(t)) return 'lei';
  if (/RETIRAD/.test(t)) return 'retirado';
  if (
    /ARQUIVAD|REJEITAD|PREJUDICAD|PERDEU|EFIC[AÁ]CIA|VETAD|DEVOLVID|SEM EFEITO|INADMITID/.test(t)
  ) {
    return 'parado';
  }
  if (emTramitacao === false) return 'parado';
  return 'tramitando';
}

/** "Lei 10836/04", "Lei Complementar nº 200/2023"... citado no despacho da Câmara. */
function normaNoTexto(texto) {
  const m = (texto ?? '').match(
    /(Lei Complementar|Lei|Emenda Constitucional)\s*(?:n[º°o.]*\s*)?([\d.]+)\s*[/,]\s*(?:de\s*)?(\d{2,4})/i,
  );
  if (!m) return undefined;
  const ano = m[3].length === 2 ? (Number(m[3]) > 50 ? '19' : '20') + m[3] : m[3];
  return `${m[1]} ${m[2].replace(/\./g, '')}/${ano}`;
}

// ---------------------------------------------------------------- Senado (Flávio)

async function senadoFlavio() {
  const lista = await getJson(`${SENADO}/processo?codigoParlamentarAutor=${FLAVIO_SENADO}`);
  const itens = [];
  for (const p of lista) {
    const tipo = p.identificacao.split(' ')[0];
    if (!TIPOS_PROJETO.has(tipo)) continue;
    const d = await cacheado(`senado-${p.id}.json`, `${SENADO}/processo/${p.id}`);
    const autoria = (d.autoriaIniciativa ?? []).find((a) => a.codigoParlamentar === FLAVIO_SENADO);
    if (!autoria) continue;
    const norma = d.normaGerada?.descricao;
    itens.push({
      cargo: 'senado',
      tipo,
      numero: d.numero,
      ano: d.ano,
      data: d.dataInicioEfetivo ?? p.dataApresentacao,
      ementa: ementa(d.conteudo?.ementa ?? p.ementa),
      papel: autoria.ordem === 1 ? 'Autor' : 'Coautor',
      situacao: situacao(d.situacaoAtual, !!norma, d.tramitando === 'Sim'),
      situacaoTexto: d.situacaoAtual ?? (d.tramitando === 'Sim' ? 'Em tramitação' : 'Encerrada'),
      norma: norma?.replace(/ de \d{2}\/\d{2}\/\d{4}$/, '').replace('nº ', ''),
      url: `https://www25.senado.leg.br/web/atividade/materias/-/materia/${d.codigoMateria}`,
    });
  }

  // Relatorias: o endpoint às vezes fica fora do ar; sem ele, a página avisa.
  let relatorias = true;
  try {
    const rel = await getJson(`${SENADO}/processo/relatoria?codigoParlamentar=${FLAVIO_SENADO}`, 3);
    const vistos = new Set(itens.map((i) => `${i.tipo} ${i.numero}/${i.ano}`));
    for (const r of rel) {
      const tipo = (r.identificacaoProcesso ?? '').split(' ')[0];
      if (!TIPOS_PROJETO.has(tipo) || !r.idProcesso) continue;
      const d = await cacheado(`senado-${r.idProcesso}.json`, `${SENADO}/processo/${r.idProcesso}`);
      const chave = `${d.sigla} ${d.numero}/${d.ano}`;
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      const norma = d.normaGerada?.descricao;
      itens.push({
        cargo: 'senado',
        tipo: d.sigla,
        numero: d.numero,
        ano: d.ano,
        data: d.dataInicioEfetivo,
        ementa: ementa(d.conteudo?.ementa),
        papel: 'Relator',
        situacao: situacao(d.situacaoAtual, !!norma, d.tramitando === 'Sim'),
        situacaoTexto: d.situacaoAtual ?? '',
        norma: norma?.replace(/ de \d{2}\/\d{2}\/\d{4}$/, '').replace('nº ', ''),
        url: `https://www25.senado.leg.br/web/atividade/materias/-/materia/${d.codigoMateria}`,
      });
    }
  } catch (e) {
    console.warn('Relatorias do Senado indisponíveis:', e.message);
    relatorias = false;
  }
  return { itens, relatorias };
}

// ---------------------------------------------------------------- Câmara (Lula)

/** Arquivo anual da Câmara indexado por id (traz a situação atual de cada proposição). */
const anos = new Map();
async function anoCamara(ano) {
  if (!anos.has(ano)) {
    const { dados } = await cacheado(`camara-${ano}.json`, `${CAMARA_ARQ}/proposicoes-${ano}.json`);
    anos.set(ano, new Map(dados.map((p) => [p.id, p])));
  }
  return anos.get(ano);
}

async function itemCamara(id, ano, cargo, papel) {
  let p = (await anoCamara(ano)).get(id);
  if (!p) {
    const d = (await cacheado(`camara-prop-${id}.json`, `${CAMARA}/proposicoes/${id}`)).dados;
    p = { ...d, ultimoStatus: d.statusProposicao };
  }
  const st = p.ultimoStatus ?? {};
  const norma = normaNoTexto(st.despacho);
  return {
    cargo,
    tipo: p.siglaTipo,
    numero: p.numero,
    ano: p.ano,
    data: (p.dataApresentacao ?? '').slice(0, 10),
    ementa: ementa(p.ementa),
    papel,
    situacao: situacao(st.descricaoSituacao, !!norma && /NORMA/i.test(st.descricaoSituacao ?? '')),
    situacaoTexto: st.descricaoSituacao ?? '',
    norma: /NORMA/i.test(st.descricaoSituacao ?? '') ? norma : undefined,
    url: `https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=${p.id}`,
  };
}

/** Todas as páginas de uma consulta da API da Câmara. */
async function todasPaginas(url) {
  const out = [];
  for (let pag = 1; ; pag++) {
    const r = await getJson(`${url}&itens=100&pagina=${pag}`);
    out.push(...r.dados);
    if (!r.links.some((l) => l.rel === 'next')) return out;
  }
}

async function camaraLula() {
  const itens = [];
  let requerimentos = 0;

  // deputado federal, 1987–1991
  for (let ano = 1987; ano <= 1991; ano++) {
    const lista = await todasPaginas(
      `${CAMARA}/proposicoes?idDeputadoAutor=${LULA_CAMARA}&ano=${ano}`,
    );
    for (const p of lista) {
      if (!TIPOS_PROJETO.has(p.siglaTipo)) {
        requerimentos++;
        continue;
      }
      itens.push(await itemCamara(p.id, p.ano, 'deputado', 'Autor'));
    }
  }

  // presidente: projetos de lei, de lei complementar e PECs do Poder Executivo, mais as MPs
  const mandatos = [
    { cargo: 'presidente-1', de: '2003-01-01', ate: '2010-12-31' },
    { cargo: 'presidente-3', de: '2023-01-01', ate: HOJE },
  ];
  for (const m of mandatos) {
    for (let ano = Number(m.de.slice(0, 4)); ano <= Number(m.ate.slice(0, 4)); ano++) {
      const lista = await todasPaginas(
        `${CAMARA}/proposicoes?siglaTipo=PL&siglaTipo=PLP&siglaTipo=PEC&autor=Poder%20Executivo&ano=${ano}`,
      );
      const doAno = await anoCamara(ano);
      for (const p of lista) {
        const data = (doAno.get(p.id)?.dataApresentacao ?? p.dataApresentacao ?? '').slice(0, 10);
        if (data && (data < m.de || data > m.ate)) continue;
        itens.push(await itemCamara(p.id, p.ano, m.cargo, 'Enviado pelo governo'));
      }
      // MPs: nenhuma das duas Casas tem o registro completo. A ficha da Câmara para
      // quando a MP segue para o Senado; o Senado não guarda a lei gerada pelas MPs
      // antigas. Por isso a situação junta as duas: o que o Congresso aprovou virou lei.
      const mps = await cacheado(
        `senado-mpv-${ano}.json`,
        `${SENADO}/processo?sigla=MPV&ano=${ano}`,
      );
      const naCamara = new Map(
        [...doAno.values()].filter((p) => p.siglaTipo === 'MPV').map((p) => [p.numero, p]),
      );
      for (const p of mps) {
        const data = (p.dataApresentacao ?? '').slice(0, 10);
        if (!/Presid/.test(p.autoria ?? '') || data < m.de || data > m.ate) continue;
        const numero = Number(p.identificacao.split(' ')[1].split('/')[0]);
        const cam = naCamara.get(numero)?.ultimoStatus ?? {};
        const normaCamara = /NORMA/i.test(cam.descricaoSituacao ?? '');
        const aprovada = /^APROVAD/.test(p.siglaTipoDeliberacao ?? '');
        const encerrada = /PERDA_EFICACIA|REJEITAD|INADIMITID|REVOGAD|PREJUDICAD/.test(
          p.siglaTipoDeliberacao ?? '',
        );
        const lei = !!p.normaGerada || normaCamara || aprovada;
        itens.push({
          cargo: m.cargo,
          tipo: 'MPV',
          numero,
          ano,
          data,
          ementa: ementa(p.ementa),
          papel: 'Enviado pelo governo',
          situacao: lei
            ? 'lei'
            : encerrada
              ? 'parado'
              : situacao(cam.descricaoSituacao || p.situacaoAtual, false, p.tramitando === 'Sim'),
          situacaoTexto: lei
            ? 'Aprovada pelo Congresso'
            : (cam.descricaoSituacao || p.situacaoAtual || '').trim(),
          norma:
            p.normaGerada?.replace(/ de \d{2}\/\d{2}\/\d{4}$/, '').replace('nº ', '') ??
            (normaCamara ? normaNoTexto(cam.despacho) : undefined),
          url: `https://www25.senado.leg.br/web/atividade/materias/-/materia/${p.codigoMateria}`,
        });
      }
    }
  }
  return { itens, requerimentos };
}

// ---------------------------------------------------------------- gravação

function ordenar(itens) {
  return itens.sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''));
}

function gravar(id, conteudo) {
  const arq = join(OUT, `projetos-${id}.json`);
  writeFileSync(arq, JSON.stringify(conteudo) + '\n');
  console.log(`${arq}: ${conteudo.itens.length} itens`);
}

const flavio = await senadoFlavio();
// a Alerj não tem API: a lista vem pronta do scripts/alerj_flavio.py
const alerj = JSON.parse(
  readFileSync(join(import.meta.dirname, 'dados', 'alerj-flavio.json'), 'utf8'),
).map((i) => ({ ...i, ementa: ementa(i.ementa) }));
gravar('flavio', {
  id: 'flavio',
  geradoEm: HOJE,
  cargos: [
    {
      key: 'alerj',
      label: 'Deputado estadual no RJ (Alerj)',
      period: '2003–2019',
      fonte: 'Alerj — sistema de proposições',
      fonteUrl:
        'https://alerjln1.alerj.rj.gov.br/scpro1519.nsf/flaviobolsonaroint?OpenForm&ExpandView',
    },
    {
      key: 'senado',
      label: 'Senador pelo RJ',
      period: '2019–hoje',
      fonte: 'Senado Federal — dados abertos',
      fonteUrl: `${SENADO}/processo?codigoParlamentarAutor=${FLAVIO_SENADO}`,
    },
  ],
  avisos: [
    'Na Alerj, "autor" é quem aparece primeiro na lista de autores e "coautor" é quem assina junto. As resoluções que viraram norma são, na maioria, homenagens (Medalha Tiradentes e títulos de benemérito). A contagem é do site, feita no sistema da Alerj; a Folha publicou outra contagem (208 propostas, 51 leis), com critério não informado.',
    ...(flavio.relatorias
      ? []
      : [
          'As relatorias não estão nesta lista porque o serviço do Senado que as fornece estava fora do ar na última atualização.',
        ]),
  ],
  itens: ordenar([...flavio.itens, ...alerj]),
});

const lula = await camaraLula();
gravar('lula', {
  id: 'lula',
  geradoEm: HOJE,
  cargos: [
    {
      key: 'deputado',
      label: 'Deputado federal por SP',
      period: '1987–1991',
      fonte: 'Câmara dos Deputados — dados abertos',
      fonteUrl: `${CAMARA}/proposicoes?idDeputadoAutor=${LULA_CAMARA}`,
    },
    {
      key: 'presidente-1',
      label: 'Presidente, 1º e 2º mandatos',
      period: '2003–2010',
      fonte: 'Câmara dos Deputados e Senado Federal (MPs) — dados abertos',
      fonteUrl: `${CAMARA}/proposicoes?autor=Poder%20Executivo&siglaTipo=PL&siglaTipo=PLP&siglaTipo=PEC`,
    },
    {
      key: 'presidente-3',
      label: 'Presidente, 3º mandato',
      period: '2023–hoje',
      fonte: 'Câmara dos Deputados e Senado Federal (MPs) — dados abertos',
      fonteUrl: `${CAMARA}/proposicoes?autor=Poder%20Executivo&siglaTipo=PL&siglaTipo=PLP&siglaTipo=PEC`,
    },
  ],
  avisos: [
    'As emendas que ele apresentou ao texto da Constituição (1987–1988) não estão nesta lista: ficam em outra base, sem consulta por autor. Segundo o Congresso em Foco, foram 41 emendas, das quais 7 foram aprovadas.',
    `Ficaram de fora ${lula.requerimentos} requerimentos de informação, que são pedidos ao governo e não projetos.`,
    'Como presidente, entram projetos de lei, de lei complementar, PECs e medidas provisórias enviados pelo governo. Projetos de crédito do Orçamento tramitam no Congresso Nacional e ficam de fora.',
    `Das medidas provisórias, ${
      lula.itens.filter((i) => i.tipo === 'MPV' && /^abre cr[eé]dito/i.test(i.ementa)).length
    } abrem crédito extraordinário: liberam dinheiro do Orçamento para uma despesa urgente. Elas entram porque contam nas estatísticas oficiais de MPs; para achá-las, busque "crédito".`,
  ],
  itens: ordenar(lula.itens),
});
