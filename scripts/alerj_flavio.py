"""Baixa as proposições de Flávio Bolsonaro como deputado estadual (Alerj, 2003–2019) e grava
scripts/dados/alerj-flavio.json, que o scripts/projetos.mjs junta à página do candidato.

Uso: python -I scripts/alerj_flavio.py [pasta_de_cache]

Fonte: o sistema antigo de proposições da Alerj (Lotus Domino), uma base por legislatura
(scpro0307.nsf, scpro0711.nsf, scpro1115.nsf, scpro1519.nsf). Em cada base, a visão
"flaviobolsonaroint" lista tudo em que ele assina, agrupado por tipo e número, com a tramitação.

Detalhes do servidor (out/2026):
- só um dos dois IPs do domínio responde (186.237.51.238); o script conecta direto nele;
- responde só a navegadores (User-Agent) e recusa "Start=" e "Count=" escritos por extenso;
  com o nome do parâmetro codificado (%53tart, %43ount) o Domino aceita e devolve até 1000 linhas.
"""
import hashlib, html, http.client, json, os, re, sys, tempfile, time, unicodedata
import xml.etree.ElementTree as ET

IP = '186.237.51.238'
HOST = 'alerjln1.alerj.rj.gov.br'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36'
LEGISLATURAS = ['0307', '0711', '1115', '1519']
TIPOS = {
    'Proposta de Emenda Constitucional': 'PEC',
    'Projeto de Lei Complementar': 'PLC',
    'Projeto de Lei': 'PL',
    'Projeto de Decreto Legislativo': 'PDL',
    'Projeto de Resolução': 'PR',
}
CACHE = sys.argv[1] if len(sys.argv) > 1 else os.path.join(tempfile.gettempdir(), 'politica-sem-gritos-alerj')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dados', 'alerj-flavio.json')


def dec(b):
    try:
        return b.decode('utf-8')
    except UnicodeDecodeError:
        return b.decode('latin-1')


def get(path, tries=5):
    """Página do servidor da Alerj, com cache em disco e novas tentativas (o servidor é instável)."""
    os.makedirs(CACHE, exist_ok=True)
    fn = os.path.join(CACHE, hashlib.md5(path.encode()).hexdigest() + '.html')
    if os.path.exists(fn) and os.path.getsize(fn) > 0:
        return dec(open(fn, 'rb').read())
    for t in range(tries):
        try:
            c = http.client.HTTPConnection(IP, 80, timeout=60)
            c.request('GET', path, headers={'Host': HOST, 'User-Agent': UA, 'Accept': 'text/html'})
            r = c.getresponse()
            body = r.read()
            if r.status == 200 and body:
                open(fn, 'wb').write(body)
                time.sleep(0.5)
                return dec(body)
        except Exception as e:
            print('  erro', path, e, file=sys.stderr)
        time.sleep(3 * (t + 1))
    raise RuntimeError(f'sem resposta em {path}')


def clean(s):
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', s or ''))).strip()


def ascii_upper(s):
    return unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().upper()


def cols(e):
    res = {}
    for d in e.findall('entrydata'):
        vals = [t.text or '' for t in d.iter() if t.tag in ('text', 'number', 'datetime')]
        res[int(d.get('columnnumber'))] = ' '.join(vals).strip()
    return res


def iso(d):
    return f'{d[:4]}-{d[4:6]}-{d[6:8]}' if len(d) >= 8 else ''


def projetos(leg):
    """Projetos (com a tramitação) da visão do Flávio numa legislatura."""
    db = f'/scpro{leg}.nsf'
    form = get(f'{db}/flaviobolsonaroint?OpenForm&CollapseView')
    view = re.search(rf'{re.escape(db)}/([0-9a-f]{{32}})/\$searchForm', form).group(1)
    entries, start = [], '1'
    while True:
        root = ET.fromstring(get(f'{db}/{view}?ReadViewEntries&%53tart={start}&%43ount=1000&ExpandView').encode('utf-8'))
        page = root.findall('viewentry')
        novas = page if start == '1' else page[1:]  # a primeira repete a última da página anterior
        entries += novas
        if len(page) < 1000 or not novas:
            break
        start = page[-1].get('position')
    out, cat, num = [], None, None
    for e in entries:
        pos = e.get('position').split('.')
        c = cols(e)
        if len(pos) == 1:
            cat = c.get(0, '')
        elif len(pos) == 2:
            num = c.get(1, '')
        elif cat not in TIPOS:
            continue
        elif len(pos) == 3:
            out.append({'cat': cat, 'num': num, 'unid': e.get('unid'), 'texto': clean(c.get(5)),
                        'data': c.get(6, ''), 'tram': []})
        elif out and out[-1]['num'] == num:
            out[-1]['tram'].append({'texto': clean(c.get(5)), 'data': c.get(6, '')})
    # a visão repete o mesmo projeto (mesma ficha) em alguns casos, como o PL 3373/2006 (15 vezes)
    out = list({p['unid']: p for p in out}.values())
    for p in out:
        doc = clean(get(f'{db}/{view}/{p["unid"]}?OpenDocument'))
        m = re.search(r'Autor\(es\):\s*(.*?)\s+(?:A ASSEMBL|O GOVERNADOR|RESOLVE|DECRETA)', doc, re.I)
        p['autores'] = m.group(1) if m else ''
        p['url'] = f'https://{HOST}{db}/{view}/{p["unid"]}?OpenDocument'
    return out


def situacao(p):
    """lei (virou norma), retirado, tramitando (voltou a andar depois de 2023) ou parado."""
    tram = sorted(p['tram'], key=lambda t: t['data'])
    for t in tram:
        if t['texto'].startswith('Resultado Final'):
            norma = t['texto'].split('=>')[-1].strip()
            return 'lei', f'Virou {norma}'
    if any('Retirada Definitiva' in t['texto'] and 'Deferido' in t['texto'] for t in tram):
        return 'retirado', 'Retirado a pedido do autor'
    if any('Veto Total => Mantido o Veto' in t['texto'] for t in tram):
        return 'parado', 'Vetado pelo governador'
    ult = tram[-1] if tram else {'texto': '', 'data': ''}
    fim = re.search(r'arquivo|final de legislatura', ult['texto'], re.I)
    if ult['data'] >= '2023' and not fim:
        return 'tramitando', 'Desarquivado ou anexado a outro projeto em 2023–2024'
    return 'parado', 'Arquivado'


itens = []
for leg in LEGISLATURAS:
    ps = projetos(leg)
    print(leg, len(ps), 'projetos', file=sys.stderr)
    for p in ps:
        autores = re.sub(r'^DEPUTAD[OA]S?\s+', '', ascii_upper(p['autores']))
        primeiro = autores.split(',')[0]
        sit, sit_txt = situacao(p)
        num = p['num']
        itens.append({
            'cargo': 'alerj',
            'tipo': TIPOS[p['cat']],
            'numero': int(num[6:]),
            'ano': int(num[:4]),
            'data': iso(p['data']),
            'ementa': p['texto'].split('=>')[0].strip(),
            'papel': 'Autor' if 'FLAVIO BOLSONARO' in primeiro else 'Coautor',
            'situacao': sit,
            'situacaoTexto': sit_txt,
            'url': p['url'],
        })
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump(itens, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(OUT, len(itens), 'itens', file=sys.stderr)
