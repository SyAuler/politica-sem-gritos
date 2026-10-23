"""Soma as viagens a serviço do órgão superior Presidência da República por ano. Usado no card
"Viagens da Presidência".

Uso:
  1. Baixe os arquivos anuais em https://portaldatransparencia.gov.br/download-de-dados/viagens
     (o Portal pede verificação humana) e descompacte o AAAA_Viagem.csv de cada ano.
  2. python -I scripts/orcamento/viagens_presidencia.py <AAAA_Viagem.csv> [...]

O site usa o valor líquido (diárias + passagens + outros gastos - devoluções), somando viagens
realizadas e não realizadas. Em 2023–2025 dá R$ 150,6 milhões (o Aos Fatos cita R$ 150,5 milhões).
"""
import csv, sys
from collections import defaultdict

csv.field_size_limit(10**9)


def num(s):
    return float(s.replace('.', '').replace(',', '.') or 0)


for path in sys.argv[1:]:
    tot = defaultdict(float)
    n = defaultdict(int)
    with open(path, encoding='latin-1', newline='') as fh:
        r = csv.reader(fh, delimiter=';')
        h = next(r)
        ix = {k: h.index(k) for k in h}
        for row in r:
            if row[ix['Nome do órgão superior']] != 'Presidência da República':
                continue
            parts = {
                k: num(row[ix['Valor ' + k]])
                for k in ('diárias', 'passagens', 'outros gastos', 'devolução')
            }
            for k, v in parts.items():
                tot[k] += v
            n[row[ix['Situação']]] += 1
    liq = tot['diárias'] + tot['passagens'] + tot['outros gastos'] - tot['devolução']
    print(path)
    print('  ' + ', '.join('%s %.2f mi' % (k, v / 1e6) for k, v in tot.items()))
    print('  líquido %.2f mi; processos %s' % (liq / 1e6, dict(n)))
