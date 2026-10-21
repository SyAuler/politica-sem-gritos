import {
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  AI_LINKS,
  AI_QUESTIONS,
  BLOC_NOTE,
  CANDIDATES,
  CHAMBERS,
  EDITORIAL_RULES,
  FIRST_ROUND,
  INDICATORS,
  LAW_READING,
  LAW_RECORDS,
  LAW_ROLES,
  LIMITATIONS,
  SITE,
  UPDATES,
  SCENARIOS,
  SNAPSHOT,
  TOPICS,
  TOPIC_GROUPS,
  UPDATED_AT,
} from './data';
import {
  CandidateId,
  Chamber,
  Indicator,
  IncomeLine,
  Proposal,
  RecordRole,
  YearValue,
} from './models';
import { PaperStack, TearSide, shuffledPostitColors, shuffledTearSides } from './paper-stack';
import { SourceLinks } from './source-links';
import { Divida } from './divida';
import { Glossario } from './glossario';
import { HISTORICO_AT } from './fontes';
import {
  CASE_DEFENSES,
  CASE_GROUPS,
  CASE_OUTCOMES,
  CASE_READING,
  CASE_RECORDS,
  CASE_RUMORS,
} from './processos';

type Role = 'base' | 'independente' | 'oposicao' | 'pendente';

interface BlocView {
  role: Role;
  label: string;
  seats: number;
  pct: number;
  parties: string;
}

@Component({
  selector: 'app-inicio',
  host: { '(window:scroll)': 'onScroll()' },
  imports: [SourceLinks, PaperStack, Divida, Glossario],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio {
  protected readonly topics = TOPICS;
  /** Filtro de temas em grupos; tema sem conteúdo ainda não aparece. */
  protected readonly topicGroups = TOPIC_GROUPS.map((g) => ({
    label: g.label,
    topics: g.ids.map((id) => TOPICS.find((t) => t.id === id)).filter((t) => !!t),
  })).filter((g) => g.topics.length);
  protected readonly chambers = CHAMBERS;
  protected readonly scenarios = SCENARIOS;
  protected readonly indicators = INDICATORS;
  protected readonly snapshot = SNAPSHOT;
  protected readonly firstRound = FIRST_ROUND;
  /** Resultado do 1º turno com foto e a barra de cada um (a régua vai de 0 a 60% dos válidos). */
  protected readonly firstRoundView = FIRST_ROUND.results.map((r) => ({
    ...r,
    photo: CANDIDATES.find((c) => c.id === r.id)!.photo.src,
    bar: (r.pct / 60) * 100,
  }));
  /** Números derivados do resultado: diferença entre os dois e soma dos demais candidatos. */
  protected readonly firstRoundMath = (() => {
    const [a, b] = FIRST_ROUND.results;
    const votes = (v: string): number => Number(v.replace(/\./g, ''));
    return {
      points: Math.abs(a.pct - b.pct),
      votes: Math.abs(votes(a.votes) - votes(b.votes)).toLocaleString('pt-BR'),
      others: 100 - a.pct - b.pct,
    };
  })();
  /** Dias até o 2º turno, contados no relógio de quem lê. */
  protected readonly daysToRunoff = (() => {
    const [y, m, d] = FIRST_ROUND.runoffDate.split('-').map(Number);
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return Math.round((new Date(y, m - 1, d).getTime() - start.getTime()) / 86_400_000);
  })();
  protected readonly blocNote = BLOC_NOTE;
  protected readonly rules = EDITORIAL_RULES;
  protected readonly limitations = LIMITATIONS;
  protected readonly updates = UPDATES;
  protected readonly site = SITE;
  protected readonly updatedAt = [UPDATED_AT, HISTORICO_AT]
    .sort()
    .at(-1)!
    .split('-')
    .reverse()
    .join('/');

  protected readonly slides = [
    {
      id: 'pais',
      kicker: 'Antes de escolher um lado',
      title: 'Você é brasileiro. \nDefenda seu país \nNão partido político.',
      text: 'Partidos passam. O preço do mercado, o emprego e os serviços públicos ficam com você.',
      cta: 'Comparar propostas',
      href: '#comparar',
      image: '/carrossel/horizonte.svg',
      position: 'right center',
      tone: 'escuro',
      credit: '',
      creditUrl: '',
    },
    {
      id: 'evidencia',
      kicker: 'Sem nota, sem torcida',
      title: 'Menos narrativa. \nMais evidência.',
      text: 'O que cada candidato propõe, o que os dados mostram e o que pode mudar na sua vida. Você lê, confere a fonte e decide.',
      cta: 'Ver como estamos hoje',
      href: '#hoje',
      image: '/carrossel/urna.webp',
      position: 'right center',
      tone: 'claro',
      credit: 'Foto: TSE (domínio público)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Urna_eletr%C3%B4nica_brasileira_UE2020.jpg',
    },
    {
      id: 'congresso',
      kicker: `2º turno em ${FIRST_ROUND.runoff}`,
      title: 'Presidente propõe. \nO Congresso decide.',
      text: 'Câmara e Senado já foram eleitos. Veja o que cada resultado encontraria pela frente.',
      cta: 'Ver os cenários',
      href: '#congresso',
      image: '/carrossel/congresso.webp',
      position: 'right center',
      tone: 'escuro',
      credit: 'Foto: Agência Senado (CC BY 2.0)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Imagens_de_Bras%C3%ADlia_-_Congresso_Nacional_(50059647053).jpg',
    },
  ];
  /** Lados de rasgo embaralhados: as duas folhas de candidato nunca rasgam do mesmo lado. */
  /** Rasgo da folha de cada candidato: o de Flávio é fixo; o de Lula, um lado sorteado. */
  protected readonly tearSides: Record<CandidateId, TearSide | TearSide[]> = {
    flavio: ['right', 'bottom'],
    lula: shuffledTearSides()[0],
  };
  /** Guia do vídeo: rasgo embaixo somado a um dos lados, sorteado. */
  protected readonly viralTear: TearSide[] = ['bottom', Math.random() < 0.5 ? 'left' : 'right'];
  /** Uma cor por bilhete, em ordem embaralhada a cada carregamento. */
  protected readonly postitColors = shuffledPostitColors();
  protected readonly slide = signal(0);
  protected readonly paused = signal(false);
  /** Botão "voltar ao início": aparece depois de rolar mais de uma tela e meia. */
  protected readonly showTop = signal(false);

  /** Quanto da página já foi lido, de 0 a 1: desenha o anel em volta do botão. */
  protected readonly readProgress = signal(0);

  protected onScroll(): void {
    this.showTop.set(window.scrollY > window.innerHeight * 1.5);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.readProgress.set(max > 0 ? Math.min(1, window.scrollY / max) : 0);
  }

  /** Rotação automática ligada? A pessoa pode pausar pelo botão; começa desligada para quem pede menos movimento. */
  protected readonly autoplay = signal(true);

  constructor() {
    const destroyRef = inject(DestroyRef);
    // só no navegador: na geração das páginas estáticas não há relógio nem janela
    afterNextRender(() => {
      const fromUrl = new URLSearchParams(location.search).get('tema');
      if (fromUrl && TOPICS.some((t) => t.id === fromUrl)) {
        this.topicId.set(fromUrl);
      }
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.autoplay.set(false);
      }
      const timer = setInterval(() => {
        if (this.autoplay() && !this.paused()) {
          this.go(this.slide() + 1);
        }
      }, 7000);
      destroyRef.onDestroy(() => clearInterval(timer));
    });
  }

  protected go(index: number): void {
    this.slide.set((index + this.slides.length) % this.slides.length);
  }

  protected readonly topicId = signal(TOPICS[0].id);
  /** Começa invertido: Lula à esquerda. O botão "Inverter colunas" troca. */
  protected readonly swapped = signal(true);
  protected readonly scenarioId = signal<CandidateId>('lula');

  protected readonly topic = computed(() => this.topics.find((t) => t.id === this.topicId())!);
  protected readonly candidates = computed(() =>
    this.swapped() ? [...CANDIDATES].reverse() : CANDIDATES,
  );
  protected readonly scenario = computed(() =>
    this.scenarios.find((s) => s.id === this.scenarioId())!,
  );
  protected readonly winner = computed(() => CANDIDATES.find((c) => c.id === this.scenarioId())!);
  /** Histórico de leis na mesma ordem das colunas de candidatos. */
  protected readonly lawRecords = computed(() =>
    this.candidates().map((c) => ({ ...LAW_RECORDS.find((r) => r.id === c.id)!, candidate: c })),
  );
  protected readonly lawReading = LAW_READING;
  protected readonly lawRoles = LAW_ROLES;

  // ---------- processos e investigações ----------
  protected readonly caseOutcomes = CASE_OUTCOMES;
  protected readonly caseReading = CASE_READING;
  /** Casos de cada candidato, na ordem das colunas, separados em grupos e com a contagem por desfecho. */
  protected readonly caseRecords = computed(() =>
    this.candidates().map((c) => {
      const cases = CASE_RECORDS.find((r) => r.id === c.id)!.cases;
      const own = cases.filter((k) => k.group === 'pessoal');
      return {
        candidate: c,
        rumors: CASE_RUMORS[c.id],
        defense: CASE_DEFENSES[c.id],
        groups: CASE_GROUPS.map((g) => ({ ...g, cases: cases.filter((k) => k.group === g.key) })),
        tally: CASE_OUTCOMES.map((o) => {
          const n = own.filter((k) => k.outcome === o.key).length;
          return { key: o.key, n, label: o.count[n === 1 ? 0 : 1] };
        }).filter((o) => o.n > 0),
        total: own.length,
      };
    }),
  );
  protected readonly outcomeLabel = (key: string) =>
    CASE_OUTCOMES.find((o) => o.key === key)?.label ?? key;
  protected readonly lawRoleText = (label: string) =>
    LAW_ROLES.find((r) => r.label === label)?.text ?? '';
  protected readonly hasExecutive = (roles: RecordRole[]) =>
    roles.some((r) => r.kind === 'executivo');

  // ---------- "Tire suas dúvidas com uma IA" ----------
  protected readonly aiQuestions = AI_QUESTIONS;
  protected readonly aiLinks = AI_LINKS;
  protected readonly aiChoice = signal('tema');
  /** Pergunta montada com o tema escolhido; a pessoa pode editar antes de levar. */
  protected readonly aiText = linkedSignal(() =>
    AI_QUESTIONS.find((q) => q.id === this.aiChoice())!.text.replace(
      '{tema}',
      this.topic().title.toLowerCase(),
    ),
  );
  protected readonly aiCopied = signal(false);

  protected aiHref(ai: { url: string; prefill: boolean }): string {
    return ai.prefill ? ai.url + encodeURIComponent(this.aiText()) : ai.url;
  }

  /** Copia a pergunta (as IAs sem pergunta no link precisam dela para colar). */
  protected copyAiText(): void {
    navigator.clipboard?.writeText(this.aiText()).then(
      () => {
        this.aiCopied.set(true);
        setTimeout(() => this.aiCopied.set(false), 4000);
      },
      () => undefined,
    );
  }

  protected askAboutTopic(): void {
    this.aiChoice.set('tema');
  }

  protected pickTopic(event: Event): void {
    this.setTopic((event.target as HTMLSelectElement).value);
  }

  // ---------- tema no endereço e compartilhamento ----------
  /** Troca o tema e grava no endereço (?tema=…), para o link levar direto a ele. */
  protected setTopic(id: string): void {
    this.topicId.set(id);
    const url = new URL(location.href);
    url.searchParams.set('tema', id);
    history.replaceState(history.state, '', url);
  }

  protected readonly linkCopied = signal(false);

  private topicLink(): string {
    // na geração das páginas estáticas não há endereço: o link certo aparece no navegador
    if (typeof location === 'undefined') {
      return '';
    }
    const url = new URL(location.origin + location.pathname);
    url.searchParams.set('tema', this.topicId());
    url.hash = 'comparar';
    return url.toString();
  }

  private topicShareText(): string {
    return `${this.topic().title}: compare as propostas de Lula e Flávio Bolsonaro, com a página de cada uma no plano oficial.`;
  }

  protected whatsAppLink(): string {
    return (
      'https://wa.me/?text=' + encodeURIComponent(`${this.topicShareText()} ${this.topicLink()}`)
    );
  }

  /** Usa o compartilhamento do aparelho quando existe; senão, copia o link. */
  protected shareTopic(): void {
    const data = {
      title: 'Política sem Gritos — ' + this.topic().title,
      text: this.topicShareText(),
      url: this.topicLink(),
    };
    if (navigator.share) {
      navigator.share(data).catch(() => undefined);
      return;
    }
    navigator.clipboard?.writeText(data.url).then(() => {
      this.linkCopied.set(true);
      setTimeout(() => this.linkCopied.set(false), 4000);
    });
  }

  /** Etiqueta da proposta, com a página do plano quando houver (ex.: "Plano oficial, p. 30"). */
  protected proposalTag(p: Proposal): string {
    return p.pages ? `${this.statusLabel(p.status)}, p. ${p.pages}` : this.statusLabel(p.status);
  }

  protected statusLabel(status: Proposal['status']): string {
    return {
      oficial: 'Plano oficial',
      'nao-localizado': 'O que o plano não diz',
    }[status];
  }

  /** Agrupa as bancadas pelo papel que teriam no cenário escolhido: a cor indica o papel, não o candidato. */
  protected blocs(chamber: Chamber): BlocView[] {
    const winner = this.scenarioId();
    const roles: { role: Role; label: string }[] = [
      { role: 'base', label: `Base nominal de ${this.winner().name}` },
      { role: 'independente', label: 'Sem lado declarado' },
      { role: 'oposicao', label: 'Oposição nominal' },
    ];
    const views: BlocView[] = roles.map(({ role, label }) => {
      const parties = chamber.parties.filter((p) =>
        role === 'independente'
          ? p.bloc === 'independente'
          : role === 'base'
            ? p.bloc === winner
            : p.bloc !== winner && p.bloc !== 'independente',
      );
      const seats = parties.reduce((sum, p) => sum + p.seats, 0);
      return {
        role,
        label,
        seats,
        pct: (seats / chamber.total) * 100,
        parties: parties.map((p) => `${p.party} ${p.seats}`).join(' · '),
      };
    });
    if (chamber.pending) {
      views.push({
        role: 'pendente',
        label: 'Ainda indefinidas',
        seats: chamber.pending,
        pct: (chamber.pending / chamber.total) * 100,
        parties: 'candidaturas sub judice',
      });
    }
    return views;
  }

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
