import { Routes } from '@angular/router';
import { Inicio } from './inicio';

export const routes: Routes = [
  { path: '', component: Inicio },
  {
    // todos os projetos de um candidato; carregada só quando alguém abre a página
    path: 'candidato/:id/projetos',
    loadComponent: () => import('./projetos').then((m) => m.Projetos),
  },
  { path: '**', redirectTo: '' },
];
