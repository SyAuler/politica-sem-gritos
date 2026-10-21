"""Gera tabelas finais (nominal e R$ de 2025 pelo IPCA médio anual) e a conta 'de cada R$ 100' de 2025.
Uso: python -I 07_tabelas_finais.py <pasta_funcoes>
Deflator: índice IPCA (SIDRA 1737, var. 2266, nº-índice dez/93=100), MÉDIA DOS 12 MESES de cada ano.
Valor em R$ de 2025 = valor nominal do ano t x (média 2025 / média t). 2026: média jan-set/2026 (parcial)."""
import sys, os, json, csv, collections
B = sys.argv[1]
ip = json.load(open(os.path.join(B, "raw/ipca_1737.json"), encoding="utf-8"))[1:]
m = collections.defaultdict(list)
for r in ip: m[int(r["D3C"][:4])].append(float(r["V"]))
media = {a: sum(v) / len(v) for a, v in m.items()}
fat = {a: media[2025] / media[a] for a in media}
with open(os.path.join(B, "ipca_fatores.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["ano", "meses", "indice_medio", "fator_para_R$_2025"])
    for a in range(2000, 2027): w.writerow([a, len(m[a]), round(media[a], 4), round(fat[a], 6)])
# Arrecadação
arr = {int(r["ano"]): r for r in csv.DictReader(open(os.path.join(B, "arrecadacao_rfb_1994_2025.csv"), encoding="utf-8"))}
arr[2026] = {"ano": "2026", "subtotal_A_rfb_exceto_prev": 1515489.3463887698, "receita_previdenciaria_B": 503579.2440066299,
             "administradas_RFB_C": 2019068.5903953998, "outros_orgaos_D": 93013.39543124, "total_geral_E": 2112081.98582664}  # jan-ago/2026, Tabela II do anexo ago/2026
with open(os.path.join(B, "tabela1_arrecadacao.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["ano", "administradas_RFB_R$bi", "previdenciaria_R$bi", "outros_orgaos_R$bi", "total_geral_R$bi", "total_geral_R$bi_de_2025", "administradas_RFB_R$bi_de_2025"])
    for a in range(2003, 2027):
        r = arr[a]; g = lambda k: float(r[k]) / 1000
        w.writerow([a, round(g("administradas_RFB_C"), 1), round(g("receita_previdenciaria_B"), 1), round(g("outros_orgaos_D"), 1),
                    round(g("total_geral_E"), 1), round(g("total_geral_E") * fat[a], 1), round(g("administradas_RFB_C") * fat[a], 1)])
# Despesa
for med in ("liquidado", "pago"):
    rows = list(csv.DictReader(open(os.path.join(B, f"despesa_funcao_{med}.csv"), encoding="utf-8")))
    cols = [c for c in rows[0] if c != "ano" and not c.startswith("Função 9")]
    for real in (False, True):
        fn = os.path.join(B, f"tabela2_despesa_funcao_{med}_{'R$2025' if real else 'nominal'}_bi.csv")
        with open(fn, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f); w.writerow(["ano"] + cols)
            for r in rows:
                a = int(r["ano"]); k = fat[a] if real else 1
                w.writerow([a] + [round(float(r[c]) / 1e9 * k, 1) for c in cols])
# R$ 100 em 2025 (liquidado, sem refinanciamento)
r = [r for r in csv.DictReader(open(os.path.join(B, "despesa_funcao_liquidado.csv"), encoding="utf-8")) if r["ano"] == "2025"][0]
base = float(r["TOTAL sem refinanciamento"])
itens = sorted(((k, float(v)) for k, v in r.items() if k not in ("ano",) and not k.startswith("TOTAL") and not k.startswith("EE: Refin") and not k.startswith("Função 9")), key=lambda x: -x[1])
with open(os.path.join(B, "tabela3_de_cada_100_2025.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f); w.writerow(["item", "R$_bi_2025", "de_cada_R$100"])
    for k, v in itens: w.writerow([k, round(v / 1e9, 1), round(100 * v / base, 2)])
    w.writerow(["TOTAL sem refinanciamento", round(base / 1e9, 1), 100.0])
    w.writerow(["(fora da conta) Refinanciamento da dívida", round(float(r["EE: Refinanciamento da dívida (841/842)"]) / 1e9, 1), ""])
print("ok")
