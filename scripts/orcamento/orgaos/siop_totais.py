"""Totais da Uniao por orgao x GND x modalidade (para excluir intra-orcamentarias, mod. 91).
Uso: python -I siop_totais.py <pasta_saida> <anos...>"""
import sys, urllib.request, urllib.parse, os
EP = "https://www1.siop.planejamento.gov.br/sparql/"
Q = """PREFIX loa: <http://vocab.e.gov.br/2013/09/loa#>
SELECT ?org ?gnd ?mod (SUM(?atu) AS ?lei_mais_credito) (SUM(?emp) AS ?empenhado) (SUM(?liq) AS ?liquidado) (SUM(?pag) AS ?pago)
WHERE { GRAPH <http://orcamento.dados.gov.br/%(ano)d/> {
 ?i a loa:ItemDespesa ; loa:temUnidadeOrcamentaria ?u ; loa:temGND ?g ; loa:temModalidadeAplicacao ?m ;
    loa:valorLeiMaisCredito ?atu ; loa:valorEmpenhado ?emp ; loa:valorLiquidado ?liq ; loa:valorPago ?pag .
 ?u loa:temOrgao ?o . ?o loa:codigo ?org . ?g loa:codigo ?gnd . ?m loa:codigo ?mod .
}} GROUP BY ?org ?gnd ?mod"""
for ano in map(int, sys.argv[2:]):
    url = EP + "?" + urllib.parse.urlencode({"query": Q % {"ano": ano}})
    data = urllib.request.urlopen(urllib.request.Request(url, headers={"Accept": "text/csv"}), timeout=600).read()
    open(os.path.join(sys.argv[1], f"siop_totais_mod_{ano}.csv"), "wb").write(data); print(ano, len(data))
