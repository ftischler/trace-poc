import {
  ComponentRef,
  Directive,
  effect,
  inject,
  Injector,
  input,
  output,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { WindowPortalOutlet } from './window-portal-outlet';

const defaultExternalWindowFeatures = {
  width: 600,
  height: 400,
  left: 200,
  top: 200,
};

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[windowPortalOutlet]',
  standalone: true,
})
export class WindowPortalOutletDirective {
  title = input<string>('');
  windowName = input<string>('');
  features = input<Record<string, string | number>>(
    defaultExternalWindowFeatures
  );
  windowOpened = output<Window>();

  private injector = inject(Injector);

  initPortalOutlet() {
    const features = this.features();

    const externalWindow = window.open(
      '',
      this.windowName(),
      Object.entries(features)
        .map(([key, value]) => `${key}=${value}`)
        .join(',')
    );

    if (!externalWindow) throw new Error('Failed to init external window');

    externalWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${this.title()}</title>
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
    externalWindow.document.close();

    const element = externalWindow.document.getElementById('portal-outlet');
    if (!element) throw new Error('Portal Outlet not found');

    this.windowOpened.emit(externalWindow);

    return new WindowPortalOutlet(element, this.injector);
  }

  attachComponent<T>(
    componentPortal: ComponentPortal<T>
  ): ComponentRef<T> | null {
    const portalOutlet = this.initPortalOutlet();
    return portalOutlet?.attach(componentPortal) ?? null;
  }
}
