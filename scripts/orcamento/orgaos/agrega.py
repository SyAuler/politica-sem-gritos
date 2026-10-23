"""Agrega os CSVs do SIOP (raw/siop) por instituicao e calcula per capita, % da Uniao e IPCA.
Uso: python -I agrega.py <pasta_base bloco4/orgaos>"""
import csv, json, os, sys, collections
B = sys.argv[1]; R = os.path.join(B, "raw"); O = os.path.join(B, "out")
ANOS = list(range(2013, 2027))

# --- populacao (IBGE) ---
pop = {int(x["D3C"]): int(x["V"]) for x in json.load(open(os.path.join(R, "pop_6579.json"), encoding="utf-8"))[1:]}
pop[2022] = 203080756                     # Censo 2022 (SIDRA 4709)
pop[2023] = round((pop[2022] * pop[2024]) ** 0.5)  # interpolacao geometrica (NAO e dado do IBGE)
# --- IPCA (SIDRA 1737, v2266 numero-indice dez/93=100) ---
idx = {x["D3C"]: float(x["V"]) for x in json.load(open(os.path.join(R, "ipca_1737_indice.json"), encoding="utf-8"))[1:]}
dez = {a: idx[f"{a}12"] for a in range(2012, 2026)}
fator = {a: dez[2025] / dez[a] for a in range(2013, 2026)}    # R$ de dez/2025
media = {a: sum(idx[f"{a}{m:02d}"] for m in range(1, 13)) / 12 for a in range(2013, 2026)}
fator_media = {a: media[2025] / media[a] for a in range(2013, 2026)}  # alternativo: media anual

ENT = {  # nome: (orgaos, UOs ou None, UOs excluidas)
 "Camara dos Deputados": ({"01000"}, None, set()),
 "Senado Federal": ({"02000"}, None, set()),
 "TCU": ({"03000"}, None, set()),
 "STF": ({"10000"}, None, set()),
 "STJ": ({"11000"}, None, set()),
 "Justica Federal": ({"12000"}, None, set()),
 "Justica Militar da Uniao": ({"13000"}, None, set()),
 "Justica Eleitoral (sem Fundo Partidario)": ({"14000"}, None, {"14901"}),
 "Fundo Partidario (UO 14901)": ({"14000"}, {"14901"}, set()),
 "Justica do Trabalho": ({"15000"}, None, set()),
 "Justica do DF e Territorios": ({"16000"}, None, set()),
 "CNJ": ({"17000"}, None, set()),
 "Judiciario da Uniao (10000-17000, sem Fundo Partidario)": ({"10000","11000","12000","13000","14000","15000","16000","17000"}, None, {"14901"}),
 "MPU (34000)": ({"34000"}, None, set()),
 "CNMP (59000)": ({"59000"}, None, set()),
 "DPU (29000; em 2013 UO 30109 no MJ)": ({"29000","30000"}, None, set()),
 "Presidencia da Republica - orgao 20000 (todas UOs)": ({"20000"}, None, set()),
 "Presidencia da Republica - UO 20101": ({"20000"}, {"20101"}, set()),
 "Vice-Presidencia (orgao 60000)": ({"60000"}, None, set()),
}
M = ["lei_mais_credito", "empenhado", "liquidado", "pago"]
res = collections.defaultdict(lambda: collections.defaultdict(float))
for a in ANOS:
    for r in csv.DictReader(open(os.path.join(R, "siop", f"siop_execucao_{a}.csv"), encoding="utf-8")):
        for nome, (orgs, uos, excl) in ENT.items():
            if r["org"] not in orgs or (uos and r["uo"] not in uos) or r["uo"] in excl: continue
            if r["org"] == "30000" and r["uo"] != "30109": continue
            d = res[(nome, a)]
            for m in M: d[m] += float(r[m])
            if r["gnd"] == "1":
                for m in ("liquidado", "pago"):
                    d["pessoal_" + m] += float(r[m])
                    k = {"01": "inativos_", "03": "pensoes_"}.get(r["elem"], "ativos_e_encargos_")
                    d[k + m] += float(r[m])
# total da Uniao (exclui intra-orcamentarias, modalidade 91)
tot = collections.defaultdict(lambda: collections.defaultdict(float))
for a in ANOS:
    for r in csv.DictReader(open(os.path.join(R, "siop", f"siop_totais_mod_{a}.csv"), encoding="utf-8")):
        if r["mod"] == "91": continue
        for m in ("liquidado", "pago"):
            tot[a]["total_" + m] += float(r[m])
            if r["gnd"] != "6": tot[a]["sem_amort_" + m] += float(r[m])
            if r["org"] != "75000": tot[a]["sem_divida75000_" + m] += float(r[m])

campos = ["instituicao", "ano", "populacao", "dotacao_atualizada", "empenhado", "liquidado", "pago",
          "pessoal_liquidado", "ativos_e_encargos_liquidado", "inativos_liquidado", "pensoes_liquidado", "pessoal_pago",
          "pct_pessoal_no_liquidado", "pago_por_habitante", "liquidado_por_habitante", "pct_uniao_total_pago", "pct_uniao_sem_amortizacao_pago",
          "fator_ipca_dez2025", "liquidado_R$2025", "pago_R$2025", "pago_por_hab_R$2025"]
with open(os.path.join(O, "orgaos_siop_2013_2026.csv"), "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f, delimiter=";")
    w.writerow(campos)
    for nome in ENT:
        for a in ANOS:
            d = res[(nome, a)]; liq = d["liquidado"]; fa = fator.get(a)
            w.writerow([nome, a, pop[a], round(d["lei_mais_credito"]), round(d["empenhado"]), round(liq), round(d["pago"]),
                        round(d["pessoal_liquidado"]), round(d["ativos_e_encargos_liquidado"]), round(d["inativos_liquidado"]),
                        round(d["pensoes_liquidado"]), round(d["pessoal_pago"]),
                        f"{100*d['pessoal_liquidado']/liq:.1f}" if liq else "", f"{d['pago']/pop[a]:.2f}", f"{liq/pop[a]:.2f}",
                        f"{100*d['pago']/tot[a]['total_pago']:.4f}", f"{100*d['pago']/tot[a]['sem_amort_pago']:.4f}",
                        f"{fa:.6f}" if fa else "", round(liq*fa) if fa else "", round(d["pago"]*fa) if fa else "",
                        f"{d['pago']*fa/pop[a]:.2f}" if fa else ""])
with open(os.path.join(O, "uniao_total_2013_2026.csv"), "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f, delimiter=";"); ks = sorted(tot[2024]); w.writerow(["ano"] + ks)
    for a in ANOS: w.writerow([a] + [round(tot[a][k]) for k in ks])
with open(os.path.join(O, "ipca_populacao.csv"), "w", newline="", encoding="utf-8-sig") as f:
    w = csv.writer(f, delimiter=";"); w.writerow(["ano", "ipca_indice_dez", "fator_dez2025", "ipca_indice_media_anual", "fator_media2025", "populacao", "fonte_pop"])
    for a in range(2013, 2026):
        fp = "Censo 2022 (SIDRA 4709)" if a == 2022 else ("interpolacao geometrica 2022-2024 (nao IBGE)" if a == 2023 else "SIDRA 6579")
        w.writerow([a, dez[a], f"{fator[a]:.6f}", f"{media[a]:.2f}", f"{fator_media[a]:.6f}", pop[a], fp])
# resumo em tela (R$ milhoes)
for nome in ENT:
    print("\n##", nome)
    for a in ANOS:
        d = res[(nome, a)]
        print(a, *(f"{d[m]/1e6:,.1f}" for m in ["lei_mais_credito","empenhado","liquidado","pago","pessoal_liquidado","inativos_liquidado","pensoes_liquidado"]))
print("\n## Uniao")
for a in ANOS: print(a, {k: f"{v/1e9:,.1f}" for k, v in sorted(tot[a].items())})
for a in range(2013,2026): print(a, pop[a], round(fator[a],4), round(fator_media[a],4))
