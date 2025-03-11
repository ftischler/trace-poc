import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MatButton } from '@angular/material/button';
import { WINDOW_PORTAL_DATA } from '../window-portal/window-portal-outlet';
import { JsonPipe } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, JsonPipe],
  template: ` <div>{{ data | json }}</div>
    <button mat-button (click)="reload()">Reload</button>`,
})
export default class TraceComponent {
  data = inject(WINDOW_PORTAL_DATA);

  traceResource = httpResource(() => ({
    url: `https://jsonplaceholder.typicode.com/todos/1`,
  }));

  reload() {
    this.traceResource.reload();
  }
}
