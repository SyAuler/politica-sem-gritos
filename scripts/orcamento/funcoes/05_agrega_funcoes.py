"""Agrega os CSV do SPARQL do SIOP (siop_AAAA.csv) em despesa por função, por ano.
Recorte: Orçamentos Fiscal (esfera 10) e da Seguridade Social (esfera 20); exclui modalidade 91 (intra-orçamentária,
operações entre órgãos da própria União, que duplicariam valores) — mesmo recorte do RREO Anexo 2 'exceto intra'.
Encargos Especiais (função 28) é desdobrado em:
  refinanciamento (subfunções 841/842); serviço da dívida (subfunções 843/844) separado em juros (GND 2) e
  amortização sem refinanciamento (demais GND, na prática GND 6);
  transferências a estados/municípios (subfunções 845 e 847), outros encargos (restante da função 28).
A subfunção 846 (Outros Encargos Especiais) fica inteira em 'outros encargos' — inclui p.ex. cobertura do resultado
negativo do Banco Central, precatórios/RPV, pensões militares e financiamentos (GND 5).
Uso: python -I 05_agrega_funcoes.py <pasta_siop> <medida: liquidado|pago|empenhado|dot_inicial|dot_atualizada> <saida.csv>"""
import sys, os, csv, glob, collections
FUN = {"01":"Legislativa","02":"Judiciária","03":"Essencial à Justiça","04":"Administração","05":"Defesa Nacional",
"06":"Segurança Pública","07":"Relações Exteriores","08":"Assistência Social","09":"Previdência Social","10":"Saúde",
"11":"Trabalho","12":"Educação","13":"Cultura","14":"Direitos da Cidadania","15":"Urbanismo","16":"Habitação",
"17":"Saneamento","18":"Gestão Ambiental","19":"Ciência e Tecnologia","20":"Agricultura","21":"Organização Agrária",
"22":"Indústria","23":"Comércio e Serviços","24":"Comunicações","25":"Energia","26":"Transporte","27":"Desporto e Lazer"}
EE = ["EE: Refinanciamento da dívida (841/842)", "EE: Juros e encargos da dívida (843/844, GND 2)",
      "EE: Amortização da dívida sem refinanciamento (843/844)", "EE: Transferências a estados e municípios (845/847)",
      "EE: Outros encargos especiais (846 e demais)"]
pasta, medida, saida = sys.argv[1:4]
tab = collections.defaultdict(collections.Counter)
for fn in sorted(glob.glob(os.path.join(pasta, "siop_*.csv"))):
    ano = int(os.path.basename(fn)[5:9])
    for r in csv.DictReader(open(fn, encoding="utf-8")):
        cod = lambda k: r[k].rsplit("/", 1)[1]
        esf, fun, sub, gnd, mod = cod("esf"), cod("fun"), cod("sub"), cod("gnd"), cod("mod")
        if esf not in ("10", "20") or mod == "91": continue
        v = float(r[medida] or 0)
        if fun == "28":
            if sub in ("841", "842"): k = EE[0]
            elif sub in ("843", "844") and gnd == "2": k = EE[1]
            elif sub in ("843", "844"): k = EE[2]
            elif sub in ("845", "847"): k = EE[3]
            else: k = EE[4]
        else:
            k = FUN.get(fun, "Função " + fun)
        tab[ano][k] += v
cols = list(FUN.values()) + EE
extras = sorted({k for a in tab for k in tab[a]} - set(cols)); cols += extras
with open(saida, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["ano"] + cols + ["TOTAL com refinanciamento", "TOTAL sem refinanciamento"])
    for a in sorted(tab):
        t = sum(tab[a].values())
        w.writerow([a] + [round(tab[a][c], 2) for c in cols] + [round(t, 2), round(t - tab[a][EE[0]], 2)])
print("ok", saida, "extras:", extras)
