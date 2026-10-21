import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'candidato/:id/projetos',
    renderMode: RenderMode.Prerender,
    // uma página estática para cada candidato
    getPrerenderParams: async () => [{ id: 'lula' }, { id: 'flavio' }],
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
