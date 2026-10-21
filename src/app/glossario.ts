import { Component, input } from '@angular/core';
import { PaperStack } from './paper-stack';

/**
 * Glossário recolhido: o título mostra as etiquetas e, aberto, explica cada uma.
 * Usado para os papéis numa lei (autor, coautor...) e para os desfechos de processos
 * (anulado, absolvido, arquivado...).
 */
@Component({
  selector: 'app-glossario',
  imports: [PaperStack],
  template: `
    <app-paper class="law-glossary" variant="liso">
      <details>
        <summary>
          <span class="law-glossary-text">
            <span class="law-glossary-title">{{ titulo() }}</span>
            <span class="law-glossary-chips" aria-hidden="true">
              @for (r of itens(); track r.label) {
                <span class="law-how">{{ r.label }}</span>
              }
            </span>
          </span>
          <span class="law-glossary-icon" aria-hidden="true"></span>
        </summary>
        <p class="note">{{ intro() }}</p>
        <dl>
          @for (r of itens(); track r.label) {
            <div>
              <dt>
                <span class="law-how">{{ r.label }}</span>
              </dt>
              <dd>{{ r.text }}</dd>
            </div>
          }
        </dl>
      </details>
    </app-paper>
  `,
  styleUrl: './glossario.scss',
})
export class Glossario {
  readonly titulo = input.required<string>();
  readonly intro = input('');
  readonly itens = input.required<{ label: string; text: string }[]>();
}
