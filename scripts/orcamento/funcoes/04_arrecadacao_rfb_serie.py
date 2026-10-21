"""Extrai os totais anuais da planilha oficial da RFB 'arrecadacao-das-receitas-federais-1994-a-2025.xlsx'
(uma aba por ano, R$ milhões correntes). Uso: python -I 04_arrecadacao_rfb_serie.py <xlsx> <saida.csv>"""
import sys, csv, openpyxl, unicodedata
def norm(s): return unicodedata.normalize("NFKD", str(s)).encode("ascii", "ignore").decode().upper()
wb = openpyxl.load_workbook(sys.argv[1], data_only=True, read_only=True)
keys = {"[A]": "subtotal_A_rfb_exceto_prev", "[B]": "receita_previdenciaria_B", "[C]": "administradas_RFB_C",
        "[D]": "outros_orgaos_D", "[E]": "total_geral_E"}
out = []
for ws in wb.worksheets:
    rows = list(ws.iter_rows(values_only=True))
    hdr = next(r for r in rows if r[0] and norm(r[0]).startswith("RECEITAS"))
    col = [i for i, h in enumerate(hdr) if h and norm(h).strip() == "TOTAL"][0]
    rec = {"ano": ws.title}
    for r in rows:
        if r[0] is None: continue
        lab = norm(r[0]).replace(" ", "")
        if "[" in lab:
            k = lab[lab.index("["):lab.index("[") + 3]   # primeiro rótulo entre colchetes da linha
            if k in keys: rec[keys[k]] = r[col]
    out.append(rec)
with open(sys.argv[2], "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, ["ano"] + list(keys.values())); w.writeheader()
    for rec in out:
        w.writerow({k: (round(v, 1) if isinstance(v, float) else v) for k, v in rec.items()})
        print(rec["ano"], *(f"{rec.get(n, float('nan')):,.0f}" for n in keys.values()))
