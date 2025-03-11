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
  Type,
} from '@angular/core';

export const WINDOW_PORTAL_DATA = new InjectionToken('WINDOW_PORTAL_DATA');

export type WindowPortalOptions<T> = {
  data?: T;
};

export const injectWindowPortal = <T>() => {
  const parent = inject(Injector);

  return {
    createPortal: (
      cmp: Type<unknown>,
      options: WindowPortalOptions<T> = { data: undefined }
    ) => {
      const injector = Injector.create({
        providers: [
          {
            provide: WINDOW_PORTAL_DATA,
            useFactory: () => options.data,
          },
        ],
        parent,
      });
      return new ComponentPortal(cmp, null, injector);
    },
  };
};

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
