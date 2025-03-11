import { BasePortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EmbeddedViewRef,
  EnvironmentInjector,
  inject,
  InjectionToken,
  Injector,
} from '@angular/core';

const defaultExternalWindowFeatures = {
  width: 600,
  height: 400,
  left: 200,
  top: 200,
};

export const WINDOW_PORTAL_DATA = new InjectionToken('WINDOW_PORTAL_DATA');
export const WINDOW_PORTAL_FEATURES = new InjectionToken<
  Record<string, string | number>
>('WINDOW_PORTAL_FEATURES');
export const WINDOW_PORTAL_TARGET = new InjectionToken<string>(
  'WINDOW_PORTAL_TARGET'
);
export const WINDOW_PORTAL_TITLE = new InjectionToken<string>(
  'WINDOW_PORTAL_TITLE'
);

export type WindowPortalOptions<T> = {
  data?: T;
  features?: Record<string, string | number>;
  target?: string;
  windowTitle?: string;
};

export const createInjector = <T>(
  options: WindowPortalOptions<T>,
  parent = inject(Injector)
) =>
  Injector.create({
    providers: [
      {
        provide: WINDOW_PORTAL_DATA,
        useFactory: () => options.data,
      },
      {
        provide: WINDOW_PORTAL_FEATURES,
        useFactory: () => options.features ?? defaultExternalWindowFeatures,
      },
      {
        provide: WINDOW_PORTAL_TARGET,
        useFactory: () => options.target ?? '',
      },
      {
        provide: WINDOW_PORTAL_TITLE,
        useFactory: () => options.windowTitle ?? '',
      },
    ],
    parent,
  });

export class WindowPortalOutlet extends BasePortalOutlet {
  private applicationRef: ApplicationRef;
  private environmentInjector: EnvironmentInjector;

  constructor(private outletElement: HTMLElement, private injector: Injector) {
    super();
    this.applicationRef = injector.get(ApplicationRef);
    this.environmentInjector = injector.get(EnvironmentInjector);
  }

  override attachComponentPortal<T>(
    componentPortal: ComponentPortal<T>
  ): ComponentRef<T> {
    const componentRef = createComponent(componentPortal.component, {
      environmentInjector: this.environmentInjector,
      elementInjector: componentPortal.injector || this.injector,
    });

    this.applicationRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<unknown>)
      .rootNodes[0];

    this.outletElement.appendChild(domElem);

    componentRef.onDestroy(() => {
      this.applicationRef.detachView(componentRef.hostView);
    });

    return componentRef;
  }

  override attachTemplatePortal<C>(): EmbeddedViewRef<C> {
    throw new Error('WindowPortalOutlet can only be used with ComponentPortal');
  }
}
