import { Routes } from '@angular/router';
import { Inicio } from './inicio';

export const routes: Routes = [
  { path: '', component: Inicio },
  {
    // todos os projetos de um candidato; carregada só quando alguém abre a página
    path: 'candidato/:id/projetos',
    loadComponent: () => import('./projetos').then((m) => m.Projetos),
  },
  {
    // contexto do país: economia ano a ano e para onde vão os impostos
    path: 'o-pais-em-numeros',
    loadComponent: () => import('./pais').then((m) => m.Pais),
  },
  { path: '**', redirectTo: '' },
];
