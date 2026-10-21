"""Soma anual da arrecadação federal a partir do CSV de dados abertos da RFB (arrecadacao-estado.csv).
Grupos: administradas pela RFB (exceto previdenciária), receita previdenciária, administradas por outros órgãos.
Uso: python -I 03_arrecadacao_rfb.py <csv> <saida.csv>"""
import sys, csv, collections
src, dst = sys.argv[1], sys.argv[2]
rows = list(csv.reader(open(src, encoding="latin-1"), delimiter=";"))
hdr = rows[0]
def num(s, us=False):
    # O arquivo mistura formatos: em 2001-2002 há linhas com vírgula como separador de milhar ("47,953,915");
    # nas demais, ponto = milhar e vírgula = decimal ("1.753.289.168" / "102706584,5").
    s = s.strip()
    if not s: return 0.0
    return float(s.replace(",", "")) if us else float(s.replace(".", "").replace(",", "."))
PREV = {"RECEITA PREVIDENCIÁRIA", "RECEITA PREVIDENCIÁRIA - PRÓPRIA", "RECEITA PREVIDENCIÁRIA - DEMAIS"}
OUT = {"ADMINISTRADAS POR OUTROS ÓRGÃOS"}
agg = collections.defaultdict(lambda: collections.Counter()); meses = collections.defaultdict(set)
for r in rows[1:]:
    if not r or not r[0].strip(): continue
    y = int(r[0]); meses[y].add(r[1])
    us = any(v.count(",") >= 2 for v in r[3:])
    for h, v in zip(hdr[3:], r[3:]):
        g = "previdenciaria" if h.strip() in PREV else "outros_orgaos" if h.strip() in OUT else "rfb_exceto_prev"
        agg[y][g] += num(v, us)
with open(dst, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["ano", "meses", "rfb_exceto_prev", "previdenciaria", "administradas_rfb_total", "outros_orgaos", "total_geral"])
    for y in sorted(agg):
        a = agg[y]; adm = a["rfb_exceto_prev"] + a["previdenciaria"]
        w.writerow([y, len(meses[y]), round(a["rfb_exceto_prev"]), round(a["previdenciaria"]), round(adm), round(a["outros_orgaos"]), round(adm + a["outros_orgaos"])])
        print(y, len(meses[y]), *(f"{x/1e9:,.1f}" for x in (a["rfb_exceto_prev"], a["previdenciaria"], adm, a["outros_orgaos"], adm + a["outros_orgaos"])))
