"""Fundo Partidario e FEFC: soma por acao/UO cujas acoes tenham 'Campanha' ou 'Partid' no titulo.
Uso: python -I siop_fundos.py <arquivo_saida> <anos...>"""
import sys, urllib.request, urllib.parse
EP = "https://www1.siop.planejamento.gov.br/sparql/"
Q = """PREFIX loa: <http://vocab.e.gov.br/2013/09/loa#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
SELECT ?uo ?acao ?titulo (SUM(?ini) AS ?dotacao_inicial) (SUM(?atu) AS ?lei_mais_credito) (SUM(?emp) AS ?empenhado) (SUM(?liq) AS ?liquidado) (SUM(?pag) AS ?pago)
WHERE { GRAPH <http://orcamento.dados.gov.br/%(ano)d/> {
 ?i a loa:ItemDespesa ; loa:temUnidadeOrcamentaria ?u ; loa:temAcao ?a ; loa:valorDotacaoInicial ?ini ;
    loa:valorLeiMaisCredito ?atu ; loa:valorEmpenhado ?emp ; loa:valorLiquidado ?liq ; loa:valorPago ?pag .
 ?u loa:codigo ?uo . ?a loa:codigo ?acao ; rdfs:label ?titulo .
 FILTER(regex(str(?titulo), "campanha|partid", "i"))
}} GROUP BY ?uo ?acao ?titulo"""
out = open(sys.argv[1], "w", encoding="utf-8")
for ano in map(int, sys.argv[2:]):
    url = EP + "?" + urllib.parse.urlencode({"query": Q % {"ano": ano}})
    data = urllib.request.urlopen(urllib.request.Request(url, headers={"Accept": "text/csv"}), timeout=600).read().decode("utf-8")
    for l in data.splitlines()[1:]: out.write(f"{ano},{l}\n")
    print(ano, data)
