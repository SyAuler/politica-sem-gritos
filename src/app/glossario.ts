import { Component } from '@angular/core';
import { LAW_ROLES } from './data';
import { PaperStack } from './paper-stack';

/**
 * "Autor, coautor, relator: qual a diferença?" — recolhido, explica cada etiqueta de
 * papel. Aparece na seção de leis e no topo das listas de projetos.
 */
@Component({
  selector: 'app-glossario-papeis',
  imports: [PaperStack],
  template: `
    <app-paper class="law-glossary" variant="liso">
      <details>
        <summary>
          <span class="law-glossary-text">
            <span class="law-glossary-title">Autor, coautor, relator: qual a diferença?</span>
            <span class="law-glossary-chips" aria-hidden="true">
              @for (r of roles; track r.label) {
                <span class="law-how">{{ r.label }}</span>
              }
            </span>
          </span>
          <span class="law-glossary-icon" aria-hidden="true"></span>
        </summary>
        <p class="note">
          Cada lei traz uma etiqueta com o papel que o candidato teve nela. Ser autor não é o mesmo
          que assinar junto ou relatar o projeto de outra pessoa.
        </p>
        <dl>
          @for (r of roles; track r.label) {
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
export class GlossarioPapeis {
  protected readonly roles = LAW_ROLES;
}
