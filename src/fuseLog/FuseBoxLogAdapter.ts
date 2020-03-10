import * as readline from 'readline';
import { IFuseLoggerProps } from '../config/IFuseLoggerProps';
import { env } from '../env';
import { onExit } from '../utils/exit';
import { path2RegexPattern } from '../utils/utils';
import { FuseLog } from './fuseLog';

let prettyTime = require('pretty-time');

function conj(word, amount?: number) {
  return amount === 1 ? `1 ${word}` : `${amount} ${word}s`;
}

export class FuseBoxLogAdapter extends FuseLog {
  private _warnings: Array<string>;
  private _errors: Array<string>;
  private streaming: boolean;
  private startTime;
  public ignoreStatementErrors: Array<RegExp>;
  constructor(public props: IFuseLoggerProps) {
    super();
    if (!this.props.level) {
      this.props.level = 'succinct';
    }
    if (process.argv.includes('--verbose')) {
      this.props.level = 'verbose';
    }

    if (env.isTest && !process.argv.includes('--log')) this.props.level = 'disabled';
    if (props.ignoreStatementErrors) {
      this.ignoreStatementErrors = props.ignoreStatementErrors.map(item => path2RegexPattern(item));
    }

    this._warnings = [];
    this._errors = [];
    onExit('logging', () => {
      console.log('');
    });
    this.startTimeMeasure();
  }

  startStreaming() {
    this.streaming = true;
  }

  stopStreaming() {
    this.clearLine();
    this.streaming = false;
  }

  startTimeMeasure() {
    this.startTime = process.hrtime();
  }

  clearLine() {
    if (this.props.level === 'succinct') {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
    }
  }

  flush() {
    this._warnings = [];
    this._errors = [];
  }

  verbose(group: string, message: string, vars?: any) {
    if (this.props.level === 'verbose') {
      this.info(group, message, vars);
    }
  }

  clearConsole() {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }

  log(type: string, message: string) {
    const level = this.props.level;

    if (level === 'disabled') return;

    if (type === 'bottom_message') {
      return console.log(message);
    }

    if (type === 'heading') {
      return console.log(message);
    }

    if (type === 'warn') {
      return this._warnings.push(message);
    }
    if (type === 'error') {
      return this._errors.push(message);
    }

    if (this.props.level === 'verbose') {
      return console.log(message);
    }

    if (type === 'echo') {
      return console.log(message);
    }

    if (!this.streaming) {
      return console.log(message);
    }
    //console.log(message);
    if (this.props.level === 'succinct' && this.streaming) {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(message);
    }
  }

  css(group: string, message: string) {
    this.log('info', this.getString(`${this.indent}<bold><yellow>${group}</yellow></bold> <dim>${message}</dim>`));
  }
  processing(group: string, message: string) {
    this.log('info', this.getString(`${this.indent}<bold><green>${group}</green></bold> ${message}`));
  }

  line() {
    this.echo('');
  }

  heading(message: string, vars?) {
    const str = this.getString(this.indent + message, vars);
    this.log('heading', str);
  }

  fuseReloadHeader() {
    this.line();
    this.heading('⚙  <bold><green>FuseBox $version</green></bold>', { version: env.VERSION });
    this.line();
  }
  fuseHeader(props: {
    version: string;
    FTL?: boolean;
    mode: 'development' | 'production';
    entry: string;
    cacheFolder?: string;
  }) {
    this.line();
    this.heading('⚙  <bold>FuseBox $version</bold>', props);
    this.heading('   Mode: <yellow>$mode</yellow>', props);
    this.heading('   Entry: <dim>$entry</dim>', props);
    if (props.cacheFolder) {
      this.heading('   Cache: <dim>$cacheFolder</dim>', props);
    }
    if (props.FTL !== undefined) {
      this.heading('   FTL reload: <dim>$ftl</dim>', { ftl: props.FTL ? 'enabled' : 'disabled' });
    }
    this.line();
  }

  fuseFatal(header: string, messages?: Array<string>) {
    this.echo(this.indent + `<white><bold><bgRed> FATAL </bgRed></bold></white> <bold><red>${header}</bold></red>`);

    if (messages) {
      this.echo('');
      messages.forEach(msg => {
        this.echo(this.indent + '<red><bold>- ' + msg + '</bold></red>');
      });
    }
  }

  printBottomMessages() {
    for (const item of this._warnings) {
      this.log('bottom_message', item);
    }
    for (const item of this._errors) {
      this.log('bottom_message', item);
    }
  }

  getTime() {
    return prettyTime(process.hrtime(this.startTime), 'ms');
  }
  fuseFinalise() {
    if (this.props.level === 'disabled') {
      return;
    }
    const hasErrors = this._errors.length > 0;
    const hasWarnings = this._warnings.length > 0;
    this.printBottomMessages();

    this.line();

    const time = this.getTime();

    const genericError = '<white><bold><bgRed> ERROR </bgRed></bold></white>';
    const timeFormat = `in <yellow>$time</yellow>`;
    if (hasErrors && hasWarnings) {
      this.log(
        'bottom_message',
        this.getString(
          this.indent +
            `${genericError} <red><bold>Completed with $err and <yellow>$warn</yellow> ${timeFormat}</red></bold>`,
          {
            err: conj('error', this._errors.length),
            time: time,
            warn: conj('warning', this._warnings.length),
          },
        ),
      );
    } else if (hasErrors) {
      this.log(
        'bottom_message',
        this.getString(this.indent + `${genericError} <red><bold>Completed with $err ${timeFormat}</red></bold>`, {
          err: conj('error', this._errors.length),
          time: time,
        }),
      );
    } else if (hasWarnings) {
      this.log(
        'bottom_message',
        this.getString(
          this.indent +
            `<black><bold><bgYellow> WARNING </bgYellow></bold></black>  <yellow><bold>Completed with $warn ${timeFormat}</yellow></bold>`,
          {
            time: time,
            warn: conj('warning', this._warnings.length),
          },
        ),
      );
    } else {
      this.log(
        'bottom_message',
        this.getString(
          this.indent +
            `<white><bold><bgGreen> SUCCESS </bgGreen></bold></white>  <green><bold>Completed without build issues ${timeFormat}</bold></green>`,
          {
            time: time,
          },
        ),
      );
    }
    this.line();
  }
}

export function createFuseLogger(props: IFuseLoggerProps): FuseBoxLogAdapter {
  return new FuseBoxLogAdapter(props);
}
