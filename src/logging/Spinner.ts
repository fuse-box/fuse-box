import { TerminalStyle } from './terminalStyles';
import { colorize } from './chroma';

const readline = require('readline');

export enum SpinnerType {
  DOTS = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏',
}

const DEFAULT_DELAY = 60;

export class Spinner {
  id: number;
  color: TerminalStyle;
  delay: number;
  text: string;
  spinnerChars: Array<string>;
  stream: NodeJS.WriteStream;
  onTick: (msg: string) => void;

  constructor(options: any = {}) {
    this.text = options.text || '';
    this.color = options.color || TerminalStyle.FG_WHITE;
    this.spinnerChars = this.getSpinner(options.spinner);
    this.delay = options.delay || DEFAULT_DELAY;
    this.onTick = options.onTick || this.defaultOnTick;
    this.stream = process.stdout;
  }

  start(): void {
    if (this.stream === process.stdout && this.stream.isTTY !== true) {
      return;
    }

    let current = 0;

    const iteration = () => {
      const msg =
        this.text.indexOf('%s') > -1
          ? this.text.replace('%s', this.spinnerChars[current])
          : this.spinnerChars[current] + ' ' + this.text;
      this.onTick(msg);
      current = ++current % this.spinnerChars.length;
    };
    iteration();
    this.id = setInterval(iteration, this.delay);
  }

  isSpinning(): boolean {
    return this.id !== undefined;
  }

  stop(clear?: boolean): void {
    if (!this.isSpinning) {
      return;
    }
    clearInterval(this.id);
    this.id = undefined;
    if (clear) {
      this.clearLine(this.stream);
    }
  }

  private getSpinner(spinnerType: SpinnerType = SpinnerType.DOTS): Array<string> {
    return spinnerType.split('');
  }

  private clearLine(stream) {
    readline.clearLine(stream, 0);
    readline.cursorTo(stream, 0);
  }

  private defaultOnTick(msg: string): void {
    this.clearLine(this.stream);
    this.stream.write(colorize(msg, this.color));
  }
}
