import { LitElement, customElement, html, property } from 'lit-element';

@customElement('my-element')
export class MyElement extends LitElement {
  @property()
  foo = 'foo';

  render() {
    return html`
      <p>${this.foo}</p>
    `;
  }
}
