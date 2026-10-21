# Pendências: o que ficou de fora e precisa ser tentado de novo

Itens que não entraram porque a fonte não respondeu, não tem consulta por autor ou deu dado
inconsistente. Cada um diz o que falta, por que ficou de fora e onde tentar. Ao resolver um item,
apague-o daqui e tire o aviso correspondente do site.

## Lista completa de projetos (`scripts/projetos.mjs`)

### Projetos do Flávio na Alerj (2003–2019)
- **Falta:** a lista dos projetos dele como deputado estadual. Hoje o site só mostra o resumo da
  Folha (208 propostas, 51 viraram lei estadual) e avisa na página do candidato.
- **Por quê:** o sistema antigo da Alerj (Lotus Notes) respondeu no começo e depois parou de
  responder às consultas (out/2026). Não há consulta por autor pronta.
- **Onde tentar:** `http://alerjln1.alerj.rj.gov.br/scpro0307.nsf/vlei?OpenView` e as bases das
  outras legislaturas (`scpro0711.nsf`, `scpro1115.nsf`, `scpro1519.nsf`). As visões são agrupadas
  e paginadas: baixar em páginas pequenas, com pausa entre as consultas. Outra saída é pedir a lista
  à Alerj pela Lei de Acesso à Informação.
- **Quando resolver:** acrescentar o cargo `alerj` no script, tirar o aviso de `projetos-flavio.json`
  e conferir se o total bate com o da Folha.

### Emendas do Lula na Constituinte (1987–1988)
- **Falta:** a lista das 41 emendas e quais foram aprovadas. Hoje o site usa o levantamento do
  Congresso em Foco (41 apresentadas, 7 aprovadas) e avisa na página do candidato.
- **Por quê:** as emendas da Constituinte ficam numa base própria, sem consulta por autor nos dados
  abertos da Câmara.
- **Onde tentar:** a base da Assembleia Nacional Constituinte no portal da Câmara e os anais da
  Constituinte no Senado.

### Situação dos projetos do governo que ainda aparecem "em tramitação"
- **Falta:** confirmar no Senado a situação dos projetos de lei do governo Lula que a Câmara marca
  como "aguardando apreciação pelo Senado", "aguardando encaminhamento" e parecidos.
- **Por quê:** com as medidas provisórias, a ficha da Câmara parava quando a MP seguia para o
  Senado, e o script passou a cruzar as duas Casas. Os projetos de lei ainda usam só a Câmara e
  podem ter o mesmo problema, principalmente os de 2003 a 2010.
- **Onde tentar:** `https://legis.senado.leg.br/dadosabertos/processo` (buscar pelo número na
  Câmara; até 2019 o Senado usava outra numeração, os PLC).

### Relatorias do Flávio no Senado
- **Situação:** entraram na última atualização, mas o serviço de relatorias do Senado
  (`/dadosabertos/processo/relatoria`) ficou fora do ar por um tempo no mesmo dia. Se falhar de
  novo, o script segue sem as relatorias e põe um aviso na página. Conferir o total (155) a cada
  atualização.

## Processos e investigações (`src/app/processos.ts`)

- **Conferir nos sistemas dos tribunais:** as decisões foram conferidas em reportagens (Agência
  Brasil, Poder360, Conjur e outras). Vale confirmar na consulta processual do STF a Rcl 41.910 e o
  INQ 5026, e no TSE a AIJE 0603123-40.2026.6.00.0000.
- **Casos em andamento, para acompanhar:** Dark Horse / Banco Master (PF pediu mais 90 dias em
  15/10/2026), caso Willer Tomaz (não está confirmado se virou inquérito formal), empréstimo do BRB
  (não está confirmado se Flávio é investigado na frente aberta pela PF em out/2026) e os
  inquéritos sobre Lulinha (PF pediu mais prazo em 02/10/2026).
- **Desfechos não localizados:** inquérito da Portugal Telecom ligado ao mensalão (reaberto em
  2017), apuração do MPDFT sobre o empréstimo do BRB (2021), apuração reaberta em 2020 sobre o
  suposto vazamento da Operação Furna da Onça e resposta da PGR aos pedidos de investigação de
  Flávio por atuação nos EUA (2026). Esses dois últimos ficaram fora do site até ter desfecho.
- **Procedimentos menores do Lula** citados só pela defesa ou pelo Conjur (palestras, Lei de
  Segurança Nacional, Carta Capital, ocupação do triplex): ficaram de fora até haver fonte primária.
- **Justiça Eleitoral:** as disputas da campanha de 2026 (multa ao Flávio por impulsionar
  propaganda negativa, AIJE contra a chapa dele) ficaram de fora por não tratarem de corrupção. Se
  entrarem, pesquisar também as representações contra a campanha do Lula, para manter a simetria.

## Fontes que bloqueiam acesso automático

- **Planalto (planalto.gov.br):** recusa conexões automáticas. Os links de leis apontam para a
  ficha de tramitação na Câmara ou no Senado. Se o Planalto liberar, dá para linkar o texto da lei.
- **TSE (tse.jus.br):** devolve 403. Os planos de governo foram baixados à mão pelo
  DivulgaCandContas; os resultados oficiais vêm de `resultados.tse.jus.br`, que funciona.

## Conteúdo ainda não feito

- **Menu do topo:** a seção "O que cada um já conseguiu aprovar" ainda não tem item no menu. No
  celular só cabem cinco; a ideia é criar um item "Histórico" quando entrarem os próximos blocos.
- **Bloco 3 — gastos de dinheiro público de cada candidato.**
- **Bloco 4 — para onde vão os impostos e quanto custam Congresso, STF e os outros órgãos.**
