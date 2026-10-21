import { Component } from '@angular/core';
import { SITE, UPDATED_AT } from './data';
import { HISTORICO_AT } from './fontes';

/** Rodapé do site, igual em todas as páginas: autoria, revisão, licença e créditos. */
@Component({
  selector: 'app-site-footer',
  template: `
    <footer>
      <div class="footer-grid">
        <div>
          <p class="footer-brand">Política sem Gritos <span>leia, compare, decida</span></p>
          <p>
            Projeto independente de <strong>{{ site.author }}</strong
            >. Sem vínculo com partidos, candidatos ou campanhas, sem financiamento e sem
            impulsionamento pago.
          </p>
        </div>
        <div>
          <p>
            Conteúdo revisado em {{ updatedAt }}. Toda informação traz a fonte e a data de acesso.
          </p>
          <p>
            Código aberto sob licença {{ site.license }}.
            @if (site.repoUrl) {
              <a [href]="site.repoUrl" target="_blank" rel="noopener noreferrer">Ver no GitHub</a> ·
              <a [href]="site.repoUrl + '/issues'" target="_blank" rel="noopener noreferrer"
                >apontar um erro ou pedir correção</a
              >.
            }
          </p>
          <p class="footer-credits">
            Fotos: retratos oficiais (Agência Senado; Ricardo Stuckert/PR, CC BY 2.0), TSE (domínio
            público) e Agência Senado (CC BY 2.0). Créditos completos junto de cada imagem.
          </p>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './site-footer.scss',
})
export class SiteFooter {
  protected readonly site = SITE;
  protected readonly updatedAt = [UPDATED_AT, HISTORICO_AT]
    .sort()
    .at(-1)!
    .split('-')
    .reverse()
    .join('/');
}
