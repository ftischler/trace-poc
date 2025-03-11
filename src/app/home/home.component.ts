import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { WindowPortalOutletDirective } from '../window-portal/window-portal-outlet.directive';
import TraceComponent from '../trace/trace.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, WindowPortalOutletDirective],
  styles: `
    :host {
      display: grid;
      height: 100%;
      place-items: center;
    }
  `,
  template: ` <button mat-button (click)="openTrace()">OPEN TRACE</button>
    <div windowPortalOutlet class="cdk-visually-hidden"></div>`,
})
export default class HomeComponent implements OnDestroy {
  windowPortalOutlet = viewChild.required(WindowPortalOutletDirective);

  externalWindowRef?: Window;

  ngOnDestroy() {
    this.externalWindowRef?.close();
  }

  openTrace() {
    const { componentRef, externalWindowRef } =
      this.windowPortalOutlet().openPortal(TraceComponent, {
        target: 'Trace',
        windowTitle: 'Trace',
        data: { test: 'Trace' },
        features: {
          width: 800,
          height: 600,
        },
      });

    console.log(componentRef);

    this.externalWindowRef = externalWindowRef;
  }
}
