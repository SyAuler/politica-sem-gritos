"""Soma, por ano, a despesa liquidada com modalidade de aplicação de transferência a estados/DF (30-39) e
municípios (40-49), em todas as funções (OFSS, exceto intra). Uso: python -I 08_transferencias_subnacionais.py <pasta_siop> <saida.csv>"""
import sys, os, csv, glob, collections
out = []
for fn in sorted(glob.glob(os.path.join(sys.argv[1], "siop_*.csv"))):
    a = int(os.path.basename(fn)[5:9]); c = collections.Counter()
    for r in csv.DictReader(open(fn, encoding="utf-8")):
        f = lambda k: r[k].rsplit("/", 1)[1]
        if f("esf") not in ("10", "20"): continue
        mod = f("mod")
        if not (mod[:1] in ("3", "4")): continue
        grp = "estados_DF" if mod[0] == "3" else "municipios"
        area = "encargos_especiais" if f("fun") == "28" else ("saude" if f("fun") == "10" else ("educacao" if f("fun") == "12" else "outras_funcoes"))
        c[(grp)] += float(r["liquidado"]); c[area] += float(r["liquidado"])
    out.append([a] + [round(c[k] / 1e9, 1) for k in ("estados_DF", "municipios", "encargos_especiais", "saude", "educacao", "outras_funcoes")] + [round((c["estados_DF"] + c["municipios"]) / 1e9, 1)])
with open(sys.argv[2], "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["ano", "estados_DF", "municipios", "via_encargos_especiais", "via_saude", "via_educacao", "via_outras", "total_R$bi"]); w.writerows(out)
for r in out: print(*r)
