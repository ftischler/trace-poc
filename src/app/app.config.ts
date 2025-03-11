import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideStore } from '@ngrx/store';
import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { WA_LOCAL_STORAGE } from '@ng-web-apis/common';

const authenticationInterceptor = ((
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  localStorage = inject(WA_LOCAL_STORAGE),
  token = localStorage.getItem('accessToken')
) =>
  next(
    req.clone(
      token
        ? {
            setHeaders: {
              Authentication: `Bearer ${token}`,
            },
          }
        : {}
    )
  )) satisfies HttpInterceptorFn;

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideStore(),
    provideHttpClient(withInterceptors([authenticationInterceptor])),
  ],
};
