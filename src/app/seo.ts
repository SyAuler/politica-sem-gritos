import { DOCUMENT, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_URL = 'https://politicasemgrito.com.br';

export interface PageMeta {
  title: string;
  description: string;
  /** Sempre com a barra no final ("/o-pais-em-numeros/"): é o endereço que a hospedagem serve. */
  path: string;
}

/**
 * Título, descrição, prévia de link e endereço oficial de cada página. Roda também na
 * pré-renderização, então os buscadores e o WhatsApp leem os dados certos de cada página
 * (sem isso, todas herdariam os da página inicial, que estão no index.html).
 *
 * Chame no construtor (onde `inject` funciona); a função devolvida pode ser usada depois,
 * por exemplo no ngOnInit, quando os dados da rota já chegaram.
 */
export function injectPageMeta(): (page: PageMeta) => void {
  const title = inject(Title);
  const meta = inject(Meta);
  const doc = inject(DOCUMENT);
  return (page) => {
    const url = SITE_URL + page.path;
    title.setTitle(page.title);
    meta.updateTag({ name: 'description', content: page.description });
    meta.updateTag({ property: 'og:title', content: page.title });
    meta.updateTag({ property: 'og:description', content: page.description });
    meta.updateTag({ property: 'og:url', content: url });
    meta.updateTag({ name: 'twitter:title', content: page.title });
    meta.updateTag({ name: 'twitter:description', content: page.description });
    doc.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
  };
}
