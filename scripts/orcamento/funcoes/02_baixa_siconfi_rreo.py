"""Baixa RREO da União (id_ente=1) via API SICONFI/Tesouro (apidatalake), Anexos 01 e 02, 6º bimestre 2015-2025
e último bimestre disponível de 2026. Uso: python -I 02_baixa_siconfi_rreo.py <pasta_saida>"""
import sys, os, json, urllib.request, urllib.parse
out = sys.argv[1]
base = "https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo?"
jobs = [(y, 6) for y in range(2015, 2026)] + [(2026, p) for p in (5, 4)]
for anexo in ("RREO-Anexo 01", "RREO-Anexo 02"):
    for y, p in jobs:
        fn = os.path.join(out, f"rreo_{anexo[-2:]}_{y}_b{p}.json")
        if os.path.exists(fn): continue
        q = urllib.parse.urlencode({"an_exercicio": y, "nr_periodo": p, "co_tipo_demonstrativo": "RREO",
                                    "no_anexo": anexo, "co_esfera": "U", "id_ente": 1})
        raw = urllib.request.urlopen(base + q, timeout=300).read()
        n = len(json.loads(raw)["items"])
        print(anexo, y, p, n, flush=True)
        if n: open(fn, "wb").write(raw)
