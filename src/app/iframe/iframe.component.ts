import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  styles: `
    :host {
      height: 100vh;
      display: grid;
      place-items: center;
      text-align: center;
    }
    iframe {
      margin-block-start: 1rem;
      border: 1px dotted black;
    }
  `,
  template: `<div>
    <div>This is an iframe:</div>
    <iframe src="/home"></iframe>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IframeComponent {}
