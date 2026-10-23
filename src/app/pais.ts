import { Component, computed, signal } from '@angular/core';
import { INDICATORS, gov } from './data';
import { Indicator, IncomeLine, YearValue } from './models';
import { PaperStack, shuffledPostitColors } from './paper-stack';
import { SourceLinks } from './source-links';
import { Divida } from './divida';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { injectPageMeta } from './seo';
import { ARRECADACAO, ORGAOS, POR_100_2025, SAIDA_GRUPOS } from './impostos-dados';
import {
  JUDICIARY,
  ORG_NOTES,
  ORG_SCOPE,
  PARTY_FUNDS,
  PER100_COLORS,
  PER100_NOTES,
  PER100_SHORT,
  SUPERSALARIES,
  TAX_CONCENTRATION,
  TAX_HEADLINES,
  TAX_READING,
  TAX_SOURCES,
} from './impostos';

/**
 * "O país em números" (/o-pais-em-numeros): o contexto que não compara os candidatos.
 * A economia ano a ano desde 2003 e para onde vão os impostos.
 */
@Component({
  selector: 'app-pais',
  imports: [SourceLinks, PaperStack, Divida, SiteHeader, SiteFooter],
  templateUrl: './pais.html',
  styleUrl: './pais.scss',
})
export class Pais {
  protected readonly indicators = INDICATORS;

  constructor() {
    injectPageMeta()({
      title: 'O país em números — Política sem Gritos',
      description:
        'Inflação, juros, desemprego, renda e dívida ano a ano desde 2003, e para onde vão os impostos: de cada R$ 100 gastos pelo governo federal, quanto vai para cada área e quanto custa cada instituição.',
      path: '/o-pais-em-numeros/',
    });
  }
  /** Uma cor por bilhete, em ordem embaralhada a cada carregamento. */
  protected readonly postitColors = shuffledPostitColors();

  // ---------- para onde vão os impostos ----------
  protected readonly taxHeadlines = TAX_HEADLINES;
  protected readonly taxSources = TAX_SOURCES;
  protected readonly taxReading = TAX_READING;
  protected readonly judiciary = JUDICIARY;
  protected readonly taxConcentration = TAX_CONCENTRATION;
  protected readonly judMax = Math.max(...JUDICIARY.branches.map((b) => b.value));
  /** Linha da evolução do Judiciário: por habitante (padrão) ou total. */
  protected readonly judMode = signal<'perCapita' | 'total'>('perCapita');
  /** Desenho da linha num quadro 1000 × 260, com 3 linhas de grade e rótulos só nos pontos-chave. */
  protected readonly judLine = computed(() => {
    const mode = this.judMode();
    const pts = JUDICIARY.series.map((r) => ({ year: r.year, value: r[mode] }));
    const W = 1000,
      H = 260,
      left = 64,
      right = 24,
      top = 30,
      bottom = 34;
    const vals = pts.map((p) => p.value);
    const step = mode === 'perCapita' ? 100 : 20;
    const lo = Math.floor((Math.min(...vals) * 0.9) / step) * step;
    const hi = Math.ceil((Math.max(...vals) * 1.05) / step) * step;
    const x = (i: number) => left + (i / (pts.length - 1)) * (W - left - right);
    const y = (v: number) => top + (1 - (v - lo) / (hi - lo)) * (H - top - bottom);
    const fmt = (v: number) =>
      mode === 'perCapita' ? `R$ ${Math.round(v)}` : `R$ ${v.toLocaleString('pt-BR')} bi`;
    const min = Math.min(...vals);
    const points = pts.map((p, i) => ({
      ...p,
      x: x(i),
      y: y(p.value),
      label: fmt(p.value),
      // rótulo só no primeiro, no menor e no último ano
      key: i === 0 || i === pts.length - 1 || p.value === min,
    }));
    const grid = [lo, (lo + hi) / 2, hi].map((v) => ({ y: y(v), label: fmt(v) }));
    const path = points
      .map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    return { W, H, left, right, points, grid, path, note: JUDICIARY.seriesNote[mode] };
  });
  protected readonly partyFunds = PARTY_FUNDS;
  protected readonly supersalaries = SUPERSALARIES;
  protected readonly orgNotes = ORG_NOTES;
  protected readonly orgScope = ORG_SCOPE;
  protected readonly orgs = ORGAOS;
  /** Grupos do "de cada R$ 100", com cor e explicação, e os 100 quadradinhos na mesma ordem. */
  protected readonly per100 = POR_100_2025.map((p) => ({
    ...p,
    color: PER100_COLORS[p.key],
    note: PER100_NOTES[p.key],
  }));
  protected readonly per100Squares = this.per100.flatMap((p) =>
    Array.from({ length: p.squares }, () => p),
  );
  /** Grupo realçado ao passar o mouse na legenda (os outros quadradinhos esmaecem). */
  protected readonly per100Focus = signal<string | null>(null);

  // ---------- entrada x saída, ano a ano ----------
  /** Grupo da saída em destaque (clicado na legenda); null mostra entrada e saída completas. */
  protected readonly ioFocus = signal<string | null>(null);
  protected readonly ioGroups = this.per100.map((p) => ({
    key: p.key,
    color: p.color,
    label: PER100_SHORT[p.key],
  }));
  protected toggleIo(key: string) {
    this.ioFocus.update((k) => (k === key ? null : key));
  }
  /** Anos com entrada, saída por grupo e a escala; separados por governo para a faixa de legenda. */
  protected readonly ioChart = computed(() => {
    const focus = this.ioFocus();
    const entrada = new Map(ARRECADACAO.map((r) => [r.year, r.real]));
    const rows = SAIDA_GRUPOS.map((r) => {
      const row = r as unknown as Record<string, number>;
      return {
        year: r.year,
        entrada: entrada.get(r.year) ?? 0,
        total: r.total,
        focused: focus ? row[focus] : r.total,
        segs: this.ioGroups.map((g) => ({ ...g, value: row[g.key] })),
      };
    });
    // com um grupo em destaque, a escala passa a ser a do grupo, para a evolução dele aparecer
    const max = focus
      ? Math.max(...rows.map((r) => r.focused))
      : Math.max(...rows.flatMap((r) => [r.total, r.entrada]));
    const groups: { government: string; rows: typeof rows }[] = [];
    for (const r of rows) {
      const g = gov(r.year);
      const last = groups[groups.length - 1];
      if (last?.government === g) last.rows.push(r);
      else groups.push({ government: g, rows: [r] });
    }
    return { groups, max, rows };
  });
  /** Frase acima do gráfico: como ler, ou o resumo do grupo em destaque. */
  protected readonly ioNote = computed(() => {
    const focus = this.ioFocus();
    const rows = this.ioChart().rows;
    if (!focus) {
      return 'Barra escura: o que o governo federal arrecadou. Barra colorida: o que gastou, por área, sem a rolagem da dívida. Clique numa área da legenda para ver só a evolução dela.';
    }
    const first = rows[0];
    const last = rows[rows.length - 1];
    const label = this.ioGroups.find((g) => g.key === focus)!.label;
    const pct = (last.focused / last.total) * 100;
    return `${label}: R$ ${this.fmtBi(last.focused)} bilhões em 2025 (${pct.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% do gasto total), contra R$ ${this.fmtBi(first.focused)} bilhões em 2003, em valores de 2025. Clique de novo para voltar.`;
  });

  /** Instituição aberta no painel de detalhes. */
  protected readonly orgOpen = signal<string | null>(null);
  protected readonly orgPanel = computed(() => this.orgs.find((o) => o.key === this.orgOpen()));
  protected readonly orgMax = (rows: { real: number }[]) => Math.max(...rows.map((r) => r.real));
  /** "1.101": bilhões sem casas decimais, para os rótulos das barras. */
  protected readonly fmtBi = (v: number) => Math.round(v).toLocaleString('pt-BR');
  /** Bilhões com a unidade: "489 bi", "1,69 tri" (o valor de entrada já está em bilhões). */
  protected readonly fmtBiUnit = (v: number) =>
    v >= 1000
      ? `${(v / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} tri`
      : `${Math.round(v).toLocaleString('pt-BR')} bi`;
  protected readonly fmtCents = (v: number) =>
    v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  protected readonly fmtNum = (v: number) =>
    v.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  protected readonly fmtPct = (v: number) =>
    `${v.toLocaleString('pt-BR', { maximumFractionDigits: v < 0.1 ? 3 : 2 })}%`;

  /** "R$ 23,7 mi", "R$ 180 mil": valores curtos para gráficos. */
  protected readonly money = (v: number) =>
    v >= 1_000_000_000
      ? `R$ ${(v / 1_000_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi`
      : v >= 1_000_000
        ? `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`
        : `R$ ${Math.round(v / 1000).toLocaleString('pt-BR')} mil`;
  protected readonly pctOf = (part: number, total: number) => (total ? (part / total) * 100 : 0);

  protected maxValue(indicator: Indicator): number {
    return Math.max(...indicator.series.map((p) => p.value));
  }

  /** Anos consecutivos do mesmo governo, para rotular o gráfico sem colorir por político. */
  /**
   * Média simples dos valores anuais de cada indicador por período de governo
   * (períodos seguidos do mesmo presidente contam separado). Cálculo do site.
   */
  protected readonly govAverages = (() => {
    const periods: { government: string; from: number; to: number }[] = [];
    for (const p of INDICATORS.reduce((a, i) => (i.series.length > a.series.length ? i : a))
      .series) {
      const last = periods[periods.length - 1];
      if (last?.government === p.government) {
        last.to = p.year;
      } else {
        periods.push({ government: p.government, from: p.year, to: p.year });
      }
    }
    return periods.map((period) => ({
      ...period,
      values: INDICATORS.map((ind) => {
        const pts = ind.series.filter((x) => x.year >= period.from && x.year <= period.to);
        return pts.length ? pts.reduce((sum, x) => sum + x.value, 0) / pts.length : null;
      }),
    }));
  })();

  protected groups(indicator: Indicator): { government: string; points: YearValue[] }[] {
    const out: { government: string; points: YearValue[] }[] = [];
    for (const point of indicator.series) {
      const last = out[out.length - 1];
      if (last?.government === point.government) {
        last.points.push(point);
      } else {
        out.push({ government: point.government, points: [point] });
      }
    }
    return out;
  }

  // ---------- gráfico de linhas da renda ----------
  /** Valores de hoje (descontada a inflação) ou da época. */
  protected readonly incomeMode = signal<'real' | 'nominal'>('real');

  /** Monta o desenho do gráfico de linhas (coordenadas de um quadro 1000 × 340). */
  protected lineChart(lines: IncomeLine[]) {
    const mode = this.incomeMode();
    const W = 1000;
    const H = 340;
    const left = 70;
    const right = 24;
    const top = 24;
    const bottom = 80;
    const first = Math.min(...lines.map((l) => l.start));
    const last = Math.max(...lines.map((l) => l.start + l.real.length - 1));
    const max = Math.max(...lines.flatMap((l) => l[mode]));
    const step = max > 3000 ? 1000 : 500;
    const ceil = Math.ceil(max / step) * step;
    const x = (year: number) => left + ((year - first) / (last - first)) * (W - left - right);
    const y = (v: number) => top + (1 - v / ceil) * (H - top - bottom);
    const govs = this.groups(INDICATORS[0]).filter((g) => g.points[0].year <= last);
    return {
      W,
      H,
      ticks: Array.from({ length: ceil / step + 1 }, (_, i) => ({
        y: y(i * step),
        label: 'R$ ' + (i * step).toLocaleString('pt-BR'),
      })),
      years: Array.from({ length: last - first + 1 }, (_, i) => ({
        x: x(first + i),
        label: String((first + i) % 100).padStart(2, '0'),
      })),
      govs: govs.map((g) => ({
        x1: x(g.points[0].year) - 8,
        x2: x(g.points[g.points.length - 1].year) + 8,
        label: g.government,
        parts: g.government
          .split('/')
          .map((part, i, all) => (i < all.length - 1 ? part + '/' : part)),
      })),
      baseY: H - bottom,
      lines: lines.map((l) => {
        const pts = l[mode].map((v, i) => {
          const year = l.start + i;
          return {
            x: x(year),
            y: y(v),
            year,
            v,
            // posição em % do quadro, para o balão (HTML) ficar sobre o ponto
            left: (x(year) / W) * 100,
            top: (y(v) / H) * 100,
            // quantos salários mínimos: conta feita nos valores da época, que são exatos
            ratio: l.key === 'media' ? this.minimumWages(lines, year) : null,
          };
        });
        return {
          key: l.key,
          label: l.label,
          d: pts.map((pt, i) => `${i ? 'L' : 'M'}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' '),
          pts,
          first: pts[0],
          last: pts[pts.length - 1],
        };
      }),
    };
  }

  /** Descrição dividida em antes / trecho destacado / depois. */
  protected descParts(ind: Indicator): [string, string, string] {
    const i = ind.highlight ? ind.description.indexOf(ind.highlight) : -1;
    if (i < 0) {
      return [ind.description, '', ''];
    }
    const end = i + ind.highlight!.length;
    return [ind.description.slice(0, i), ind.highlight!, ind.description.slice(end)];
  }

  /** Ponto do gráfico de linhas sob o mouse, o foco ou o toque. */
  protected readonly hoverPoint = signal<{ key: string; year: number } | null>(null);

  protected toggleHover(key: string, year: number): void {
    const cur = this.hoverPoint();
    this.hoverPoint.set(cur?.key === key && cur.year === year ? null : { key, year });
  }

  /** Renda média dividida pelo salário mínimo do mesmo ano (valores da época). */
  private minimumWages(lines: IncomeLine[], year: number): number | null {
    const media = lines.find((l) => l.key === 'media');
    const minimo = lines.find((l) => l.key === 'minimo');
    if (!media || !minimo) {
      return null;
    }
    const a = media.nominal[year - media.start];
    const b = minimo.nominal[year - minimo.start];
    return a && b ? a / b : null;
  }

  protected reais(v: number): string {
    return 'R$ ' + Math.round(v).toLocaleString('pt-BR');
  }

  /** Valor com a unidade do indicador: "4,6%" ou "R$ 3.418". */
  protected fmtValue(indicator: Indicator, value: number): string {
    return indicator.format === 'reais'
      ? 'R$ ' + Math.round(value).toLocaleString('pt-BR')
      : this.fmt1(value) + '%';
  }

  /** Rótulo em cima da barra: curto, porque a coluna é estreita ("3,4 mil" em vez de "R$ 3.418"). */
  protected fmtBar(indicator: Indicator, value: number): string {
    return indicator.format === 'reais'
      ? (value / 1000).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : this.fmt(value);
  }

  /** Uma casa decimal, para as médias da tabela ficarem com a mesma precisão. */
  protected fmt1(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  protected fmt(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }
}
