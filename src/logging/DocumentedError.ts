export class DocumentedError {
  constructor(public code: string, public message) {
    this.message = this.message + '\n Read more : http://fuse-box.org/errors/#' + this.code;
  }
}
