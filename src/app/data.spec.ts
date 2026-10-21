import {
  CANDIDATES,
  CHAMBERS,
  FIRST_ROUND,
  INDICATORS,
  LAW_RECORDS,
  LAW_ROLES,
  SCENARIOS,
  TOPIC_GROUPS,
  TOPICS,
} from './data';

/**
 * Regras editoriais do site conferidas a cada mudança no conteúdo: tudo com fonte,
 * tudo o que vem do plano com página, e o mesmo tratamento para os dois candidatos.
 */
describe('Conteúdo do site', () => {
  const ids = CANDIDATES.map((c) => c.id);
  const pageFormat = /^\d+(–\d+)?(, \d+(–\d+)?)*$/;

  it('tem os dois candidatos', () => {
    expect(ids.sort()).toEqual(['flavio', 'lula']);
  });

  it('dá o mesmo número de propostas aos dois candidatos em cada tema', () => {
    for (const topic of TOPICS) {
      const [a, b] = ids.map((id) => topic.proposals[id].length);
      expect(a).withContext(topic.id).toBe(b);
      expect(a).withContext(topic.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('dá a cada proposta do plano oficial a página e a fonte', () => {
    for (const topic of TOPICS) {
      for (const id of ids) {
        for (const p of topic.proposals[id]) {
          const where = `${topic.id} / ${id}: ${p.summary.slice(0, 50)}`;
          expect(p.summary.trim().length).withContext(where).toBeGreaterThan(20);
          expect(p.sources.length).withContext(where).toBeGreaterThan(0);
          if (p.status === 'oficial') {
            expect(p.pages).withContext(where).toMatch(pageFormat);
          }
          if (p.pages) {
            expect(p.pages).withContext(where).toMatch(pageFormat);
          }
        }
      }
    }
  });

  it('não repete a mesma proposta dentro de um tema', () => {
    for (const topic of TOPICS) {
      for (const id of ids) {
        const texts = topic.proposals[id].map((p) => p.summary);
        expect(new Set(texts).size).withContext(`${topic.id} / ${id}`).toBe(texts.length);
      }
    }
  });

  it('analisa os dois candidatos com a mesma estrutura', () => {
    for (const topic of TOPICS) {
      for (const id of ids) {
        const side = topic.impact[id];
        expect(side.mechanism.length).withContext(`${topic.id} / ${id}`).toBeGreaterThan(20);
        expect(side.benefits.length).withContext(`${topic.id} / ${id}`).toBe(2);
        expect(side.risks.length).withContext(`${topic.id} / ${id}`).toBe(3);
      }
      expect(topic.impact.monitor.length).withContext(topic.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('põe cada tema em exatamente um grupo do menu', () => {
    const grouped = TOPIC_GROUPS.flatMap((g) => g.ids);
    expect([...grouped].sort()).toEqual(TOPICS.map((t) => t.id).sort());
    expect(new Set(grouped).size).toBe(grouped.length);
  });

  it('usa só links seguros (https) nas fontes', () => {
    const all = [
      ...TOPICS.flatMap((t) => ids.flatMap((id) => t.proposals[id].flatMap((p) => p.sources))),
      ...CANDIDATES.flatMap((c) => c.sources),
      ...CHAMBERS.flatMap((c) => c.sources),
      ...INDICATORS.flatMap((i) => i.sources),
      ...FIRST_ROUND.sources,
      ...LAW_RECORDS.flatMap((r) => r.roles.flatMap((role) => role.sources)),
    ];
    for (const s of all) {
      expect(s.url)
        .withContext(s.title)
        .toMatch(/^https:\/\//);
    }
  });

  it('fecha a conta das cadeiras do Congresso', () => {
    for (const ch of CHAMBERS) {
      const seats = ch.parties.reduce((sum, p) => sum + p.seats, 0) + (ch.pending ?? 0);
      expect(seats).withContext(ch.name).toBe(ch.total);
    }
  });

  it('tem um cenário para cada candidato', () => {
    expect(SCENARIOS.map((s) => s.id).sort()).toEqual([...ids].sort());
  });

  it('mostra o histórico de leis dos dois com o mesmo número de exemplos', () => {
    expect(LAW_RECORDS.map((r) => r.id).sort()).toEqual([...ids].sort());
    const [a, b] = LAW_RECORDS.map((r) => r.roles.flatMap((role) => role.examples).length);
    expect(a).toBe(b);
    for (const r of LAW_RECORDS) {
      for (const role of r.roles) {
        const where = `${r.id} / ${role.role}`;
        expect(role.stats.length).withContext(where).toBeGreaterThan(0);
        expect(role.sources.length).withContext(where).toBeGreaterThan(0);
        for (const ex of role.examples) {
          expect(LAW_ROLES.map((role) => role.label))
            .withContext(`${where}: ${ex.title}`)
            .toContain(ex.how);
        }
      }
    }
  });
});
