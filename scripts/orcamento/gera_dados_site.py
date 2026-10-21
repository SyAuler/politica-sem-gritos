"""Gera src/app/impostos-dados.ts a partir das tabelas calculadas pelos scripts desta pasta.

Uso (depois de rodar os scripts de funcoes/ e orgaos/):
  python -I scripts/orcamento/gera_dados_site.py <pasta_funcoes> <pasta_orgaos>

<pasta_funcoes> tem tabela1_arrecadacao.csv, tabela2_despesa_funcao_liquidado_nominal_bi.csv e
ipca_fatores.csv; <pasta_orgaos> tem out/orgaos_siop_2013_2026.csv.

Todos os valores em reais de 2025 usam o mesmo método: valor nominal x (IPCA médio de 2025 /
IPCA médio do ano), com o número-índice da tabela 1737 do SIDRA.
"""
import csv, json, os, sys

fun_dir, org_dir = sys.argv[1], sys.argv[2]
OUT = os.path.join(os.path.dirname(__file__), '..', '..', 'src', 'app', 'impostos-dados.ts')
ANOS = range(2003, 2026)

fator = {int(r['ano']): float(r['fator_para_R$_2025'])
         for r in csv.DictReader(open(os.path.join(fun_dir, 'ipca_fatores.csv'), encoding='utf-8'))}

# ---------- arrecadação federal (RFB, total geral, R$ bi)
arrec = []
for r in csv.DictReader(open(os.path.join(fun_dir, 'tabela1_arrecadacao.csv'), encoding='utf-8')):
    y = int(r['ano']) if r['ano'].isdigit() else None
    if y in ANOS:
        v = float(r['total_geral_R$bi'])
        arrec.append({'year': y, 'nominal': v, 'real': round(v * fator[y], 1)})

# ---------- despesa por área (liquidado, sem refinanciamento, R$ bi)
rows = {int(r['ano']): r for r in csv.DictReader(
    open(os.path.join(fun_dir, 'tabela2_despesa_funcao_liquidado_nominal_bi.csv'), encoding='utf-8'))}
AREAS = [
    ('total', 'Gasto total (sem a rolagem da dívida)', ['TOTAL sem refinanciamento']),
    ('previdencia', 'Previdência (INSS e aposentadorias de servidores)', ['Previdência Social']),
    ('transferencias', 'Repasses a estados e municípios', ['EE: Transferências a estados e municípios (845/847)']),
    ('juros', 'Juros da dívida', ['EE: Juros e encargos da dívida (843/844, GND 2)']),
    ('assistencia', 'Assistência social (Bolsa Família, BPC)', ['Assistência Social']),
    ('saude', 'Saúde', ['Saúde']),
    ('educacao', 'Educação', ['Educação']),
    ('trabalho', 'Trabalho (seguro-desemprego, abono)', ['Trabalho']),
    ('defesa', 'Defesa', ['Defesa Nacional']),
    ('seguranca', 'Segurança pública', ['Segurança Pública']),
]
areas = []
for key, label, cols in AREAS:
    serie = [{'year': y, 'real': round(sum(float(rows[y][c]) for c in cols) * fator[y], 1)} for y in ANOS]
    areas.append({'key': key, 'label': label, 'series': serie})

# ---------- de cada R$ 100 em 2025, em 8 grupos
r25 = rows[2025]
tot = float(r25['TOTAL sem refinanciamento'])
g = lambda *cols: sum(float(r25[c]) for c in cols)
grupos = [
    ('previdencia', 'Previdência', g('Previdência Social')),
    ('transferencias', 'Repasses a estados e municípios', g('EE: Transferências a estados e municípios (845/847)')),
    ('divida', 'Dívida pública (juros e parte do principal)',
     g('EE: Juros e encargos da dívida (843/844, GND 2)', 'EE: Amortização da dívida sem refinanciamento (843/844)')),
    ('encargos', 'Outros encargos (precatórios, pensões militares, Banco Central)', g('EE: Outros encargos especiais (846 e demais)')),
    ('assistencia', 'Assistência social', g('Assistência Social')),
    ('saude', 'Saúde', g('Saúde')),
    ('educacao', 'Educação', g('Educação')),
]
resto = tot - sum(v for _, _, v in grupos)
grupos.append(('demais', 'Todas as outras áreas (trabalho, defesa, Justiça, Congresso, segurança...)', resto))
# arredonda para 100 quadradinhos pelo maior resto, para a grade fechar em 100
exato = [(k, l, v, v / tot * 100) for k, l, v in grupos]
base = [int(p) for *_, p in exato]
falta = 100 - sum(base)
ordem = sorted(range(len(exato)), key=lambda i: exato[i][3] - base[i], reverse=True)
for i in ordem[:falta]:
    base[i] += 1
por100 = [{'key': k, 'label': l, 'bi': round(v, 1), 'pct': round(p, 2), 'squares': base[i]}
          for i, (k, l, v, p) in enumerate(exato)]

# ---------- saída por ano, nos mesmos 8 grupos da grade (R$ bi de 2025), para o gráfico entrada x saída
GRUPOS_COLS = {
    'previdencia': ['Previdência Social'],
    'transferencias': ['EE: Transferências a estados e municípios (845/847)'],
    'divida': ['EE: Juros e encargos da dívida (843/844, GND 2)', 'EE: Amortização da dívida sem refinanciamento (843/844)'],
    'encargos': ['EE: Outros encargos especiais (846 e demais)'],
    'assistencia': ['Assistência Social'],
    'saude': ['Saúde'],
    'educacao': ['Educação'],
}
saida = []
for y in ANOS:
    r = rows[y]
    linha = {'year': y}
    soma = 0.0
    for k, cols in GRUPOS_COLS.items():
        v = sum(float(r[c]) for c in cols) * fator[y]
        linha[k] = round(v, 1)
        soma += v
    total = float(r['TOTAL sem refinanciamento']) * fator[y]
    linha['demais'] = round(total - soma, 1)
    linha['total'] = round(total, 1)
    saida.append(linha)

# ---------- instituições (SIOP, pago)
org = {}
for r in csv.DictReader(open(os.path.join(org_dir, 'out', 'orgaos_siop_2013_2026.csv'), encoding='utf-8-sig'), delimiter=';'):
    org.setdefault(r['instituicao'], {})[int(r['ano'])] = r
ORG = [
    ('camara', 'Câmara dos Deputados', 'Camara dos Deputados', 513, 'deputado'),
    ('senado', 'Senado Federal', 'Senado Federal', 81, 'senador'),
    ('stf', 'Supremo Tribunal Federal', 'STF', 11, 'ministro'),
    ('judiciario_uniao', 'Judiciário federal (pago pela União)',
     'Judiciario da Uniao (10000-17000, sem Fundo Partidario)', None, None),
    ('mpu', 'Ministério Público da União', 'MPU (34000)', None, None),
    ('tcu', 'Tribunal de Contas da União', 'TCU', None, None),
    ('presidencia', 'Presidência da República (unidade da Presidência)', 'Presidencia da Republica - UO 20101', None, None),
]
orgaos = []
for key, label, nome, membros, membro in ORG:
    d = org[nome]
    a = d[2025]
    pago = float(a['pago'])
    serie = [{'year': y, 'real': round(float(d[y]['pago']) * fator[y] / 1e6, 1)} for y in range(2013, 2026)]
    orgaos.append({
        'key': key, 'label': label,
        'pago2025': round(pago / 1e6, 1),
        'perCapita2025': round(float(a['pago_por_habitante']), 2),
        'pctUniao2025': round(float(a['pct_uniao_sem_amortizacao_pago']), 3),
        'pessoalPct2025': round(float(a['pct_pessoal_no_liquidado']), 1),
        'inativosPct2025': round((float(a['inativos_liquidado']) + float(a['pensoes_liquidado'])) / float(a['liquidado']) * 100, 1),
        'perMember2025': round(pago / membros / 1e6, 2) if membros else None,
        'member': membro,
        'series': serie,
    })

ts = '''// ARQUIVO GERADO por scripts/orcamento/gera_dados_site.py. Não edite à mão: rode o script.
// Arrecadação: Receita Federal (série histórica das receitas federais). Despesa por área e por
// órgão: orçamento federal executado (SIOP, endpoint SPARQL de orcamento.dados.gov.br).
// Valores em R$ bilhões (áreas e arrecadação) ou R$ milhões (órgãos); "real" = R$ de 2025 (IPCA).

export const ARRECADACAO = %s;

export const DESPESA_AREAS = %s;

export const POR_100_2025 = %s;

/** Saída por ano nos mesmos grupos da grade de R$ 100 (R$ bi de 2025). */
export const SAIDA_GRUPOS = %s;

export const ORGAOS = %s;
''' % tuple(json.dumps(x, ensure_ascii=False, indent=2) for x in (arrec, areas, por100, saida, orgaos))
open(OUT, 'w', encoding='utf-8').write(ts)
print('gravado', os.path.abspath(OUT))
print('por100', [(p['key'], p['squares']) for p in por100], sum(p['squares'] for p in por100))
for o in orgaos:
    print(o['key'], o['pago2025'], o['perCapita2025'], o['pctUniao2025'], o['perMember2025'], o['series'][0], o['series'][-1])
