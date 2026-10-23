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
import { CandidateId, Chamber, Proposal, RecordRole } from './models';
import { PaperStack, TearSide, shuffledPostitColors, shuffledTearSides } from './paper-stack';
import { SourceLinks } from './source-links';
import { Glossario } from './glossario';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';
import { HISTORICO_AT } from './fontes';
import { SPEND_READING, SPEND_RECORDS } from './gastos';
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
  imports: [SourceLinks, PaperStack, Glossario, SiteHeader, SiteFooter],
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
  // ---------- gastos de dinheiro público ----------
  protected readonly spendReading = SPEND_READING;
  /** Custos de cada candidato, na ordem das colunas. */
  protected readonly spendRecords = computed(() =>
    this.candidates().map((c) => {
      const r = SPEND_RECORDS.find((x) => x.id === c.id)!;
      return { ...r, candidate: c };
    }),
  );
  /** "R$ 23,7 mi", "R$ 180 mil": valores curtos para gráficos. */
  protected readonly money = (v: number) =>
    v >= 1_000_000_000
      ? `R$ ${(v / 1_000_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} bi`
      : v >= 1_000_000
        ? `R$ ${(v / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`
        : `R$ ${Math.round(v / 1000).toLocaleString('pt-BR')} mil`;
  protected readonly pctOf = (part: number, total: number) => (total ? (part / total) * 100 : 0);
  /** Card de custo aberto em cada coluna (um por vez); o detalhe abre abaixo dos cards. */
  protected readonly spendOpen = signal<Record<string, number | null>>({});
  protected toggleSpend(id: string, i: number) {
    this.spendOpen.update((o) => ({ ...o, [id]: o[id] === i ? null : i }));
  }
  /** Escala das barras por ano: o maior valor, do candidato ou da referência. */
  protected readonly yearMax = (rows: { main: number; reference?: number }[]) =>
    Math.max(...rows.flatMap((r) => [r.main, r.reference ?? 0]));

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

  protected fmt(value: number): string {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }
}
