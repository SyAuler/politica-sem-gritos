"""Baixa do endpoint SPARQL do SIOP (https://www1.siop.planejamento.gov.br/sparql/)
a execucao da despesa da Uniao agregada por orgao x UO x GND x elemento x resultado primario.
Uso: python -I siop_sparql.py <pasta_saida> <ano1> [<ano2> ...]"""
import sys, urllib.request, urllib.parse, os, time
EP = "https://www1.siop.planejamento.gov.br/sparql/"
Q = """PREFIX loa: <http://vocab.e.gov.br/2013/09/loa#>
SELECT ?org ?uo ?gnd ?elem ?rp (SUM(?dot) AS ?dotacao_inicial) (SUM(?atu) AS ?lei_mais_credito)
 (SUM(?emp) AS ?empenhado) (SUM(?liq) AS ?liquidado) (SUM(?pag) AS ?pago)
WHERE { GRAPH <http://orcamento.dados.gov.br/%(ano)d/> {
 ?i a loa:ItemDespesa ; loa:temUnidadeOrcamentaria ?u ; loa:temGND ?g ; loa:temElementoDespesa ?e ;
    loa:temResultadoPrimario ?r ;
    loa:valorDotacaoInicial ?dot ; loa:valorLeiMaisCredito ?atu ; loa:valorEmpenhado ?emp ;
    loa:valorLiquidado ?liq ; loa:valorPago ?pag .
 ?u loa:temOrgao ?o ; loa:codigo ?uo . ?o loa:codigo ?org . ?g loa:codigo ?gnd . ?e loa:codigo ?elem . ?r loa:codigo ?rp .
}} GROUP BY ?org ?uo ?gnd ?elem ?rp"""
out = sys.argv[1]
for ano in map(int, sys.argv[2:]):
    url = EP + "?" + urllib.parse.urlencode({"query": Q % {"ano": ano}})
    req = urllib.request.Request(url, headers={"Accept": "text/csv"})
    for t in range(3):
        try:
            data = urllib.request.urlopen(req, timeout=600).read(); break
        except Exception as ex:
            print(ano, "erro", ex); time.sleep(5)
    p = os.path.join(out, f"siop_execucao_{ano}.csv")
    open(p, "wb").write(data)
    print(ano, len(data), data.count(b"\n"))
