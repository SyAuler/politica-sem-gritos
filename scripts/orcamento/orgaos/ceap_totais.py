"""Soma CEAP (Camara) e CEAPS (Senado) por ano.
Uso: python -I ceap_totais.py <dir_camara> <dir_senado> <saida_json>
"""
import csv, sys, os, json, glob
from decimal import Decimal, InvalidOperation
csv.field_size_limit(10**9)

def dec(s, br=False):
    s = (s or '').strip()
    if not s: return Decimal(0)
    if br: s = s.replace('.', '').replace(',', '.')
    try: return Decimal(s)
    except InvalidOperation: return None

def open_text(p):
    raw = open(p, 'rb').read()
    for enc in ('utf-8-sig', 'latin-1'):
        try: return raw.decode(enc), enc
        except UnicodeDecodeError: pass

def camara(d):
    out = {}
    for p in sorted(glob.glob(os.path.join(d, 'x_Ano-*', '*.csv'))):
        txt, enc = open_text(p)
        r = csv.DictReader(txt.splitlines(), delimiter=';')
        t = dict(n=0, liq=Decimal(0), doc=Decimal(0), glosa=Decimal(0), restit=Decimal(0),
                 liq_deputados=Decimal(0), liq_liderancas=Decimal(0), bad=0, anos_linha={}, subcota={}, deputados=set(), neg=Decimal(0))
        for row in r:
            v = dec(row['vlrLiquido'])
            if v is None: t['bad'] += 1; continue
            t['n'] += 1; t['liq'] += v
            if v < 0: t['neg'] += v
            t['doc'] += dec(row['vlrDocumento']) or 0
            t['glosa'] += dec(row['vlrGlosa']) or 0
            t['restit'] += dec(row['vlrRestituicao']) or 0
            if (row['cpf'] or '').strip() or (row['ideCadastro'] or '').strip():
                t['liq_deputados'] += v; t['deputados'].add(row['nuDeputadoId'])
            else:
                t['liq_liderancas'] += v
            a = row['numAno']; t['anos_linha'][a] = t['anos_linha'].get(a, 0) + 1
            k = row['txtDescricao']; t['subcota'][k] = t['subcota'].get(k, Decimal(0)) + v
        t['deputados'] = len(t['deputados']); t['encoding'] = enc
        t['subcota'] = {k: str(v) for k, v in sorted(t['subcota'].items(), key=lambda x: -x[1])}
        out[os.path.basename(p)] = {k: (str(v) if isinstance(v, Decimal) else v) for k, v in t.items()}
    return out

def senado(d):
    out = {}
    for p in sorted(glob.glob(os.path.join(d, 'despesa_ceaps_*.csv'))):
        txt, enc = open_text(p)
        lines = txt.splitlines()
        upd = lines[0]
        r = csv.DictReader(lines[1:], delimiter=';')
        t = dict(n=0, total=Decimal(0), bad=0, senadores=set(), anos={}, tipo={}, neg=Decimal(0))
        for row in r:
            v = dec(row['VALOR_REEMBOLSADO'], br=True)
            if v is None: t['bad'] += 1; continue
            t['n'] += 1; t['total'] += v; t['senadores'].add(row['SENADOR'])
            if v < 0: t['neg'] += v
            t['anos'][row['ANO']] = t['anos'].get(row['ANO'], 0) + 1
            k = row['TIPO_DESPESA'][:60]; t['tipo'][k] = t['tipo'].get(k, Decimal(0)) + v
        t['senadores'] = len(t['senadores']); t['encoding'] = enc; t['atualizacao'] = upd
        t['tipo'] = {k: str(v) for k, v in sorted(t['tipo'].items(), key=lambda x: -x[1])}
        out[os.path.basename(p)] = {k: (str(v) if isinstance(v, Decimal) else v) for k, v in t.items()}
    return out

res = {'camara': camara(sys.argv[1]), 'senado': senado(sys.argv[2])}
json.dump(res, open(sys.argv[3], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for k, v in res['camara'].items():
    print('CAM', k, v['n'], 'liq', v['liq'], 'dep', v['liq_deputados'], 'lid', v['liq_liderancas'], 'doc', v['doc'], 'glosa', v['glosa'], 'restit', v['restit'], 'neg', v['neg'], 'ndep', v['deputados'], 'bad', v['bad'], v['encoding'], v['anos_linha'])
for k, v in res['senado'].items():
    print('SEN', k, v['n'], 'total', v['total'], 'neg', v['neg'], 'nsen', v['senadores'], 'bad', v['bad'], v['encoding'], v['anos'], v['atualizacao'])
