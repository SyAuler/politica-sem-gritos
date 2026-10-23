"""Soma os gastos com o cartão de pagamento do governo (CPGF) por ano no órgão Presidência da
República, com a parte sigilosa. Usado no card "Cartão corporativo da Presidência".

Uso:
  1. Baixe os arquivos mensais (sem verificação humana neste endereço):
     https://dadosabertos-download.cgu.gov.br/PortalDaTransparencia/saida/cpgf/AAAAMM_CPGF.zip
     (troque AAAAMM pelo ano e mês, de 201301 em diante) e descompacte os CSVs numa pasta.
  2. python -I scripts/orcamento/cartao_presidencia.py <pasta_dos_csv>

O site usa a linha do órgão 20101 (Presidência da República) e corrige os valores pelo IPCA
para reais de 2025 (fator encadeado do IPCA anual, tabela 1737 do SIDRA).
"""
import csv,glob,sys,collections
d=sys.argv[1]
tot=collections.defaultdict(float); sig=collections.defaultdict(float); org=collections.defaultdict(float); ug=collections.defaultdict(float); tr=collections.defaultdict(float); gov=collections.defaultdict(float); maxm={}
for f in sorted(glob.glob(d+'/*.csv')):
    with open(f,encoding='latin1') as fh:
        r=csv.reader(fh,delimiter=';'); h=next(r)
        for row in r:
            v=float(row[14].replace('.','').replace(',','.')); y=row[6]
            gov[y]+=v
            if row[0]!='20000': continue
            tot[y]+=v; maxm[y]=max(maxm.get(y,''),row[7])
            org[(y,row[2]+' '+row[3])]+=v
            ug[(y,row[4]+' '+row[5])]+=v
            tr[(y,row[12])]+=v
            if 'SIGILOS' in (row[11]+row[9]).upper() or 'SIGILOS' in row[10].upper(): sig[y]+=v
for y in sorted(tot): print(y,'PR %.2f'%tot[y],'sigiloso %.2f'%sig[y],'%.1f%%'%(100*sig[y]/tot[y]),'gov total CPGF %.2f'%gov[y],'ultimo mes',maxm[y])
print('--- por orgao')
for k,v in sorted(org.items()): print(k,'%.2f'%v)
print('--- top UG')
for k,v in sorted(ug.items(),key=lambda x:(x[0][0],-x[1])):
    if v>500000: print(k,'%.2f'%v)
print('--- transacao')
for k,v in sorted(tr.items()): print(k,'%.2f'%v)
