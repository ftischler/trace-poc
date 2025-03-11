import { ComponentRef, Directive, inject, Injector, Type } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  createInjector,
  WINDOW_PORTAL_FEATURES,
  WINDOW_PORTAL_TARGET,
  WINDOW_PORTAL_TITLE,
  WindowPortalOptions,
  WindowPortalOutlet,
} from './window-portal-outlet';

export type WindowOutletRef = {
  portalOutlet: WindowPortalOutlet;
  externalWindowRef: Window;
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[windowPortalOutlet]',
  standalone: true,
})
export class WindowPortalOutletDirective {
  private injector = inject(Injector);

  initPortalOutlet(injector: Injector) {
    const features = injector.get(WINDOW_PORTAL_FEATURES);
    const name = injector.get(WINDOW_PORTAL_TARGET);
    const title = injector.get(WINDOW_PORTAL_TITLE);

    const externalWindowRef = window.open(
      '',
      name,
      Object.entries(features)
        .map(([key, value]) => `${key}=${value}`)
        .join(',')
    );

    if (!externalWindowRef) throw new Error('Failed to init external window');

    externalWindowRef.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title}</title>
            <base href="/">
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            </style>
          </head>
          <body>
            <div id="portal-outlet"></div>
          </body>
        </html>
      `);
    externalWindowRef.document.close();

    const element = externalWindowRef.document.getElementById('portal-outlet');
    if (!element) throw new Error('Portal Outlet not found');

    return {
      portalOutlet: new WindowPortalOutlet(element, injector),
      externalWindowRef,
    } satisfies WindowOutletRef;
  }

  openPortal<C, T>(component: Type<C>, options: WindowPortalOptions<T>) {
    const injector = createInjector(options, this.injector);
    const { portalOutlet, externalWindowRef } = this.initPortalOutlet(injector);
    const componentRef = this.attachComponent(
      portalOutlet,
      new ComponentPortal<C>(component, null, injector)
    );

    return { componentRef, externalWindowRef };
  }

  private attachComponent<T>(
    portalOutlet: WindowPortalOutlet,
    componentPortal: ComponentPortal<T>
  ): ComponentRef<T> | null {
    return portalOutlet?.attach(componentPortal) ?? null;
  }
}
