"""Imprime tabelas markdown a partir de out/orgaos_siop_2013_2026.csv. Uso: python -I tabelas.py <csv>"""
import csv, sys, collections
rows = collections.defaultdict(list)
for r in csv.DictReader(open(sys.argv[1], encoding="utf-8-sig"), delimiter=";"): rows[r["instituicao"]].append(r)
f = lambda x: f"{float(x)/1e6:,.1f}".replace(",", "X").replace(".", ",").replace("X", ".")
g = lambda x, n=2: f"{float(x):,.{n}f}".replace(",", "X").replace(".", ",").replace("X", ".") if x else "—"
for k, L in rows.items():
    print(f"\n### {k}\n| Ano | Dotação atualizada | Liquidado | Pago | Pessoal (liq.) | dos quais inativos | pensionistas | % pessoal | Pago/hab (R$) | % da União (pago, sem amortiz.) | Pago em R$ de 2025 |")
    print("|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|")
    for r in L:
        a = r["ano"] + (" (parcial)" if r["ano"] == "2026" else "")
        print(f"| {a} | {f(r['dotacao_atualizada'])} | {f(r['liquidado'])} | {f(r['pago'])} | {f(r['pessoal_liquidado'])} | {f(r['inativos_liquidado'])} | {f(r['pensoes_liquidado'])} | {g(r['pct_pessoal_no_liquidado'],1)} | {g(r['pago_por_habitante'])} | {g(r['pct_uniao_sem_amortizacao_pago'],3)} | {f(r['pago_R$2025']) if r['pago_R$2025'] else '—'} |")
