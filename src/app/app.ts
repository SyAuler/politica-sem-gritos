import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** Casca do site: só troca entre a página principal e as listas de projetos. */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {}
