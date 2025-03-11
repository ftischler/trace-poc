import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { WindowPortalOutletDirective } from '../window-portal/window-portal-outlet.directive';
import { ComponentPortal } from '@angular/cdk/portal';
import TraceComponent from '../trace/trace.component';
import { injectWindowPortal } from '../window-portal/window-portal-outlet';

@Component({
  template: `<button mat-button (click)="openTrace()">OPEN TRACE</button>
    <div
      windowPortalOutlet
      #windowPortalOutlet
      [features]="{ width: 800, height: 600 }"
    ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, WindowPortalOutletDirective],
})
export default class HomeComponent {
  private windowPortal = injectWindowPortal();

  windowPortalOutlet = viewChild(WindowPortalOutletDirective);

  openTrace() {
    this.windowPortalOutlet()?.attachComponent(
      this.windowPortal.createPortal(TraceComponent, {
        data: { title: 'Trace' },
      })
    );
  }
}
