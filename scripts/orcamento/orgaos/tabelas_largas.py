"""Tabelas largas (orgao em colunas). Uso: python -I tabelas_largas.py <csv> > saida.txt"""
import csv, sys, collections
D = {}
for r in csv.DictReader(open(sys.argv[1], encoding="utf-8-sig"), delimiter=";"): D[(r["instituicao"], int(r["ano"]))] = r
C = [("Câmara","Camara dos Deputados"),("Senado","Senado Federal"),("TCU","TCU"),("STF","STF"),
     ("Judic. União","Judiciario da Uniao (10000-17000, sem Fundo Partidario)"),("MPU","MPU (34000)"),("CNMP","CNMP (59000)"),
     ("DPU","DPU (29000; em 2013 UO 30109 no MJ)"),("PR órgão 20000","Presidencia da Republica - orgao 20000 (todas UOs)"),
     ("PR UO 20101","Presidencia da Republica - UO 20101"),("Vice-PR 60000","Vice-Presidencia (orgao 60000)")]
br = lambda v, n: f"{v:,.{n}f}".replace(",", "X").replace(".", ",").replace("X", ".")
def tab(t, fn, n, anos=range(2013, 2027)):
    print(f"\n**{t}**\n\n| Ano | " + " | ".join(c for c, _ in C) + " |\n|---|" + "---:|" * len(C))
    for a in anos:
        print(f"| {a}{'*' if a==2026 else ''} | " + " | ".join(br(fn(D[(k, a)]), n) if fn(D[(k, a)]) is not None else "—" for _, k in C) + " |")
m = lambda c: (lambda r: float(r[c]) / 1e6)
tab("Pago (R$ milhões nominais)", m("pago"), 1)
tab("Liquidado (R$ milhões nominais)", m("liquidado"), 1)
tab("Pessoal e encargos — GND 1, liquidado (R$ milhões)", m("pessoal_liquidado"), 1)
tab("dos quais inativos + pensionistas (elementos 01 e 03, liquidado, R$ milhões)", lambda r: (float(r["inativos_liquidado"]) + float(r["pensoes_liquidado"])) / 1e6, 1)
tab("Pago por habitante (R$)", lambda r: float(r["pago_por_habitante"]), 2)
tab("% da despesa paga da União sem amortização/refinanciamento da dívida (GND 6) e sem intra-orçamentárias", lambda r: float(r["pct_uniao_sem_amortizacao_pago"]), 3)
tab("% da despesa paga total da União (inclui amortização e refinanciamento da dívida)", lambda r: float(r["pct_uniao_total_pago"]), 3)
tab("Pago em R$ milhões de dez/2025 (IPCA)", lambda r: float(r["pago_R$2025"]) / 1e6 if r["pago_R$2025"] else None, 1, range(2013, 2026))
tab("Pago por habitante em R$ de dez/2025", lambda r: float(r["pago_por_hab_R$2025"]) if r["pago_por_hab_R$2025"] else None, 2, range(2013, 2026))
