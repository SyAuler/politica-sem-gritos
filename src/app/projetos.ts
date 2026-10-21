import { Component, afterNextRender, computed, inject, input, signal } from '@angular/core';
import { LowerCasePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { CANDIDATES, LAW_ROLES } from './data';
import { ProjectFile, ProjectItem, ProjectStatus } from './models';
import { GlossarioPapeis } from './glossario';

/** Os quatro grupos de situação, na ordem em que aparecem no gráfico e na legenda. */
const STATUS: { key: ProjectStatus; label: string; hint: string }[] = [
  { key: 'lei', label: 'Virou lei', hint: 'virou lei, emenda constitucional ou resolução' },
  { key: 'tramitando', label: 'Em tramitação', hint: 'ainda pode ser votado' },
  {
    key: 'parado',
    label: 'Não avançou',
    hint: 'arquivado, rejeitado, revogado ou perdeu a validade',
  },
  { key: 'retirado', label: 'Retirado', hint: 'o próprio autor desistiu' },
];

/** Quantos itens a lista mostra de cada vez. */
const PAGE = 40;

interface Segment {
  key: ProjectStatus;
  label: string;
  count: number;
}

/**
 * Todos os projetos de um candidato (/candidato/:id/projetos), com resumo visual,
 * filtros e busca. Os dados vêm de public/dados/projetos-<id>.json, carregado só no
 * navegador: a página pré-renderizada mostra o cabeçalho e o aviso de carregamento.
 */
@Component({
  selector: 'app-projetos',
  imports: [GlossarioPapeis, LowerCasePipe],
  templateUrl: './projetos.html',
  styleUrl: './projetos.scss',
})
export class Projetos {
  /** Vem da rota (candidato/:id/projetos). */
  readonly id = input.required<string>();

  protected readonly statuses = STATUS;
  protected readonly candidate = computed(() => CANDIDATES.find((c) => c.id === this.id()));
  protected readonly data = signal<ProjectFile | null>(null);
  protected readonly failed = signal(false);

  // ---------- filtros da lista ----------
  protected readonly cargo = signal('');
  protected readonly papel = signal('');
  protected readonly status = signal<ProjectStatus | ''>('');
  protected readonly query = signal('');
  protected readonly shown = signal(PAGE);

  private readonly itens = computed(() => this.data()?.itens ?? []);

  /** Papéis presentes nos dados, na ordem do glossário, com a contagem de cada um. */
  protected readonly roles = computed(() =>
    LAW_ROLES.map((r) => ({
      label: r.label,
      count: this.itens().filter((i) => i.papel === r.label).length,
    })).filter((r) => r.count > 0),
  );

  /**
   * Uma barra por cargo e papel ("Senador · como relator"): misturar papéis num número
   * só faria parecer que leis relatadas ou assinadas junto são projetos do candidato.
   */
  protected readonly groups = computed(() =>
    (this.data()?.cargos ?? []).map((c) => ({
      ...c,
      bars: this.roles()
        .map((r) => {
          const itens = this.itens().filter((i) => i.cargo === c.key && i.papel === r.label);
          const counts = this.count(itens);
          const segments: Segment[] = STATUS.map((s) => ({
            key: s.key,
            label: s.label,
            count: counts[s.key],
          }));
          return { papel: r.label, total: itens.length, lei: counts.lei, segments };
        })
        .filter((b) => b.total > 0),
    })),
  );

  protected readonly filtered = computed(() => {
    const q = normalize(this.query().trim());
    return this.itens().filter(
      (i) =>
        (!this.cargo() || i.cargo === this.cargo()) &&
        (!this.papel() || i.papel === this.papel()) &&
        (!this.status() || i.situacao === this.status()) &&
        (!q ||
          normalize(`${i.tipo} ${i.numero}/${i.ano} ${i.ementa} ${i.norma ?? ''}`).includes(q)),
    );
  });

  protected readonly visible = computed(() => this.filtered().slice(0, this.shown()));

  /** Barra e segmento sob o mouse ou o foco: alimenta a dica do gráfico. */
  protected readonly hover = signal<{ bar: string; seg: Segment } | null>(null);

  constructor() {
    const title = inject(Title);
    afterNextRender(async () => {
      const c = this.candidate();
      if (!c) return;
      title.setTitle(`Todos os projetos de ${c.name} — Política sem Gritos`);
      try {
        const res = await fetch(`/dados/projetos-${c.id}.json`);
        if (!res.ok) throw new Error(String(res.status));
        this.data.set(await res.json());
      } catch {
        this.failed.set(true);
      }
    });
  }

  /** Clique num pedaço da barra: filtra a lista por aquele cargo, papel e situação. */
  protected pick(cargo: string, papel: string, status: ProjectStatus) {
    this.cargo.set(cargo);
    this.papel.set(papel);
    this.status.set(status);
    this.query.set('');
    this.shown.set(PAGE);
    document.getElementById('lista')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** Clique no total de um papel, no topo: lista só os projetos com aquele papel. */
  protected pickRole(papel: string) {
    this.clearFilters();
    this.papel.set(papel);
    document.getElementById('lista')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected setFilter(e: Event, target: 'query' | 'cargo' | 'papel' | 'status') {
    const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
    if (target === 'query') this.query.set(value);
    if (target === 'cargo') this.cargo.set(value);
    if (target === 'papel') this.papel.set(value);
    if (target === 'status') this.status.set(value as ProjectStatus | '');
    this.shown.set(PAGE);
  }

  protected clearFilters() {
    this.cargo.set('');
    this.papel.set('');
    this.status.set('');
    this.query.set('');
    this.shown.set(PAGE);
  }

  protected more() {
    this.shown.update((n) => n + PAGE);
  }

  protected statusLabel(key: ProjectStatus) {
    return STATUS.find((s) => s.key === key)!.label;
  }

  protected cargoLabel(key: string) {
    return this.data()?.cargos.find((c) => c.key === key)?.label ?? key;
  }

  protected date(iso: string) {
    return iso ? iso.slice(0, 10).split('-').reverse().join('/') : '';
  }

  protected pct(n: number, total: number) {
    return total ? Math.round((n / total) * 100) : 0;
  }

  private count(itens: ProjectItem[]): Record<ProjectStatus, number> & { total: number } {
    const out = { lei: 0, tramitando: 0, parado: 0, retirado: 0, total: itens.length };
    for (const i of itens) out[i.situacao]++;
    return out;
  }
}

/** Busca sem diferença de maiúsculas e acentos. */
function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
