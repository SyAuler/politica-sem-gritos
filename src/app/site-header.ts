import { Component, input } from '@angular/core';

/**
 * Cabeçalho fixo do site, igual em todas as páginas. Os links levam às partes da página
 * principal ("/#comparar") e à página "O país em números"; funcionam de qualquer página.
 */
@Component({
  selector: 'app-site-header',
  template: `
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="/">Política sem <span>Gritos</span></a>
        <nav aria-label="Seções">
          <!-- no celular aparecem os nomes curtos, para os cinco caberem sem rolagem -->
          @for (l of links; track l.href) {
            <a [href]="l.href" [attr.aria-current]="atual() === l.id ? 'page' : null"
              ><span class="long">{{ l.long }}</span
              ><span class="short">{{ l.short }}</span></a
            >
          }
        </nav>
      </div>
    </header>
  `,
  styleUrl: './site-header.scss',
})
export class SiteHeader {
  /** Página atual, para marcar o item do menu: 'pais' na página "O país em números". */
  readonly atual = input<string>('');

  protected readonly links = [
    { id: 'propostas', href: '/#comparar', long: 'Comparar propostas', short: 'Propostas' },
    { id: 'congresso', href: '/#congresso', long: 'Quem decide', short: 'Congresso' },
    { id: 'historico', href: '/#leis', long: 'O histórico dos candidatos', short: 'Histórico' },
    { id: 'pais', href: '/o-pais-em-numeros', long: 'O país em números', short: 'País' },
    { id: 'metodo', href: '/#metodo', long: 'Como lemos os fatos', short: 'Método' },
  ];
}
