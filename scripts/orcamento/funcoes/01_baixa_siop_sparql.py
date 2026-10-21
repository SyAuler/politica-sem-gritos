"""Baixa do endpoint SPARQL do orçamento federal (SIOP / orcamento.dados.gov.br)
a despesa agregada por esfera x função x subfunção x GND x modalidade, por exercício.
Uso: python -I 01_baixa_siop_sparql.py <pasta_saida> [ano_ini ano_fim]"""
import sys, os, urllib.request, urllib.parse, time
END = "https://orcamento.dados.gov.br/sparql/"
Q = """PREFIX loa: <http://vocab.e.gov.br/2013/09/loa#>
SELECT ?esf ?fun ?sub ?gnd ?mod (SUM(?ini) AS ?dot_inicial) (SUM(?atu) AS ?dot_atualizada)
 (SUM(?emp) AS ?empenhado) (SUM(?liq) AS ?liquidado) (SUM(?pag) AS ?pago)
WHERE { GRAPH <http://orcamento.dados.gov.br/%d/> {
 ?i a loa:ItemDespesa ; loa:temEsfera ?esf ; loa:temFuncao ?fun ; loa:temSubfuncao ?sub ;
    loa:temGND ?gnd ; loa:temModalidadeAplicacao ?mod ;
    loa:valorDotacaoInicial ?ini ; loa:valorLeiMaisCredito ?atu ; loa:valorEmpenhado ?emp ;
    loa:valorLiquidado ?liq ; loa:valorPago ?pag . } }
GROUP BY ?esf ?fun ?sub ?gnd ?mod"""
out = sys.argv[1]; a, b = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (2000, 2026)
for y in range(a, b + 1):
    fn = os.path.join(out, f"siop_{y}.csv")
    if os.path.exists(fn) and os.path.getsize(fn) > 1000: continue
    data = urllib.parse.urlencode({"query": Q % y}).encode()
    req = urllib.request.Request(END, data=data, headers={"Accept": "text/csv"})
    for t in range(3):
        try:
            raw = urllib.request.urlopen(req, timeout=600).read(); break
        except Exception as e:
            print(y, "erro", e); time.sleep(10)
    open(fn, "wb").write(raw); print(y, len(raw), "bytes", raw.count(b"\n"), "linhas", flush=True)
