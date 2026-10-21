"""Confere a agregação SIOP (liquidado, exceto intra) contra o RREO Anexo 2 (SICONFI), 2015-2025.
Uso: python -I 06_confere_rreo.py <pasta_funcoes>"""
import sys, os, json, csv, unicodedata
B = sys.argv[1]
def n(s): return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().strip().upper()
siop = {r["ano"]: r for r in csv.DictReader(open(os.path.join(B, "despesa_funcao_liquidado.csv"), encoding="utf-8"))}
out = []
for y in range(2015, 2026):
    d = json.load(open(os.path.join(B, f"raw/siconfi_rreo/rreo_02_{y}_b6.json"), encoding="utf-8"))["items"]
    # 2017+: coluna 'DESPESAS LIQUIDADAS ATÉ O BIMESTRE (d)' e rótulo 'exceto intra'; 2015-16: coluna 'Até o Bimestre (d)',
    # sem rótulo -> usa a 1ª ocorrência de cada conta (bloco 'exceto intra' vem antes do bloco intra no demonstrativo)
    liq = [i for i in d if (n(i["coluna"]).startswith("DESPESAS LIQUIDADAS ATE") or n(i["coluna"]) == "ATE O BIMESTRE (D)")
           and (i["rotulo"] is None or n(i["rotulo"]).startswith("TOTAL DAS DESPESAS EXCETO"))]
    def g(nome):
        v = [i["valor"] for i in liq if n(i["conta"]) == n(nome)]
        return v[0] if v else float("nan")
    tot = [i["valor"] for i in liq if n(i["conta"]).startswith("DESPESAS (EXCETO INTRA")][0]
    s = siop[str(y)]
    row = [y, tot / 1e9, float(s["TOTAL com refinanciamento"]) / 1e9]
    for f in ("Previdência Social", "Saúde", "Educação", "Assistência Social", "Encargos Especiais"):
        sv = sum(float(v) for k, v in s.items() if k.startswith("EE:")) if f == "Encargos Especiais" else float(s[f])
        row += [g(f) / 1e9, sv / 1e9]
    out.append(row)
    print(" ".join(f"{x:,.1f}" if isinstance(x, float) else str(x) for x in row))
print("colunas: ano, RREO total, SIOP total, Prev RREO, Prev SIOP, Saude RREO, Saude SIOP, Educ RREO, Educ SIOP, Assist RREO, Assist SIOP, EE RREO, EE SIOP")
