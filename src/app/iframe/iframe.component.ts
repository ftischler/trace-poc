import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  template: `<iframe src="/home"></iframe>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IframeComponent {}
