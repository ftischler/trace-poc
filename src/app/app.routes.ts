import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./iframe/iframe.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'trace',
    loadComponent: () => import('./trace/trace.component'),
  },
];
