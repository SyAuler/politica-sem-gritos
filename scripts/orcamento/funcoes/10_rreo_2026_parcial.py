"""Extrai despesa liquidada jan-ago/2026 (RREO 4º bimestre, União) por função (Anexo 2) e por grupo (Anexo 1).
Uso: python -I 10_rreo_2026_parcial.py <pasta_funcoes>"""
import sys, os, json, csv
B = sys.argv[1]
d = json.load(open(os.path.join(B, "raw/siconfi_rreo/rreo_02_2026_b4.json"), encoding="utf-8"))["items"]
FUN = ["DESPESAS (EXCETO INTRA-ORÇAMENTÁRIAS) (I)", "Previdência Social", "Saúde", "Educação", "Assistência Social", "Trabalho", "Defesa Nacional",
       "Segurança Pública", "Judiciária", "Legislativa", "Administração", "Encargos Especiais", "Serviço da Dívida Interna",
       "Serviço da Dívida Externa", "Transferências", "Transferências para a Educação Básica", "Outros Encargos Especiais"]
rows = []
for i in d:
    if i["rotulo"] and i["rotulo"].startswith("Total das Despesas Exceto") and i["coluna"].startswith("DESPESAS LIQUIDADAS AT") and i["conta"] in FUN:
        rows.append(["Anexo 2 (função)", i["conta"], round(i["valor"] / 1e9, 1)])
d1 = json.load(open(os.path.join(B, "raw/siconfi_rreo/rreo_01_2026_b4.json"), encoding="utf-8"))["items"]
for i in d1:
    if "LIQUIDADAS AT" in i["coluna"].upper() and any(k in i["conta"].upper() for k in ("JUROS E ENCARGOS", "AMORTIZA", "REFINANCIAMENTO", "DESPESAS (EXCETO")):
        rows.append(["Anexo 1 (" + (i["rotulo"] or "") + ")", i["conta"], round(i["valor"] / 1e9, 1)])
with open(os.path.join(B, "rreo_2026_jan_ago_liquidado.csv"), "w", newline="", encoding="utf-8") as f:
    csv.writer(f).writerows([["fonte", "conta", "R$_bi"]] + rows)
for r in rows: print(*r, sep=" | ")
