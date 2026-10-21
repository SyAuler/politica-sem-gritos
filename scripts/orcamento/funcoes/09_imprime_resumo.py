"""Imprime tabela-resumo (markdown) a partir de tabela2_*.csv. Uso: python -I 09_imprime_resumo.py <csv>"""
import sys, csv
rows = list(csv.DictReader(open(sys.argv[1], encoding="utf-8")))
sel = [("Prev.", "Previdência Social"), ("Saúde", "Saúde"), ("Educ.", "Educação"), ("Assist.", "Assistência Social"),
       ("Trab.", "Trabalho"), ("Defesa", "Defesa Nacional"), ("Seg.Púb.", "Segurança Pública"), ("Judic.", "Judiciária"),
       ("Legisl.", "Legislativa"), ("Adm.", "Administração"), ("Juros", "EE: Juros e encargos da dívida (843/844, GND 2)"),
       ("Amort.", "EE: Amortização da dívida sem refinanciamento (843/844)"), ("Transf. E/M", "EE: Transferências a estados e municípios (845/847)"),
       ("Outros EE", "EE: Outros encargos especiais (846 e demais)")]
named = {c for _, c in sel} | {"ano", "EE: Refinanciamento da dívida (841/842)", "TOTAL com refinanciamento", "TOTAL sem refinanciamento"}
print("| Ano | " + " | ".join(s for s, _ in sel) + " | Demais funções | **Total s/ refin.** | Refin. | Total c/ refin. |")
print("|" + "---|" * (len(sel) + 5))
for r in rows:
    if int(r["ano"]) < 2003: continue
    dem = sum(float(v) for k, v in r.items() if k not in named)
    print(f"| {r['ano']} | " + " | ".join(f"{float(r[c]):,.1f}".replace(",", "X").replace(".", ",").replace("X", ".") for _, c in sel)
          + " | " + " | ".join(f"{x:,.1f}".replace(",", "X").replace(".", ",").replace("X", ".") for x in (dem, float(r["TOTAL sem refinanciamento"]), float(r["EE: Refinanciamento da dívida (841/842)"]), float(r["TOTAL com refinanciamento"]))) + " |")
