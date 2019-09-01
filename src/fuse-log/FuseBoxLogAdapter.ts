import { FuseLog } from './fuseLog';

import * as readline from 'readline';
import { onExit } from '../utils/exit';
export interface IFuseBoxLogProps {
  level?: 'succinct' | 'verbose' | 'disabled';
}

function conj(word, amount?: number) {
  return amount === 1 ? `1 ${word}` : `${amount} ${word}s`;
}
export class FuseBoxLogAdapter extends FuseLog {
  private _warnings: Array<string>;
  private _errors: Array<string>;
  constructor(public props: IFuseBoxLogProps) {
    super();
    if (!this.props.level) {
      this.props.level = 'succinct';
    }
    this._warnings = [];
    this._errors = [];
    onExit('logging', () => {
      console.log('');
    });
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

    if (this.props.level === 'succinct') {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      process.stdout.write(message);
    }
  }

  heading(message: string, vars?) {
    const str = this.getString(this.indent + message, vars);
    this.log('heading', str);
  }

  fuseHeader(props: { version: string; mode: 'development' | 'production'; entry: string }) {
    this.echo('\n');

    this.heading('⚙  <bold><green>FuseBox $version</green></bold>', props);
    this.heading('   Mode: <yellow>$mode</yellow>', props);
    this.heading('   Entry: <dim>$entry</dim>', props);
    this.echo('\n');
  }

  fuseFinalise() {
    this.clearLine();
    const hasErrors = this._errors.length > 0;
    const hasWarnings = this._warnings.length > 0;
    for (const item of this._warnings) {
      this.log('bottom_message', item);
    }
    for (const item of this._errors) {
      this.log('bottom_message', item);
    }

    const genericError = '<white><bold><bgRed> ERROR </bgRed></bold></white>';
    if (hasErrors && hasWarnings) {
      this.log(
        'bottom_message',
        this.getString(
          this.indent +
            `@error ${genericError} <red><bold>Completed with $err and <yellow>$warn</yellow> in $time</red></bold>`,
          {
            err: conj('error', this._errors.length),
            warn: conj('warning', this._warnings.length),
            time: `1s`,
          },
        ),
      );
    } else if (hasErrors) {
      this.log(
        'bottom_message',
        this.getString(this.indent + `@error ${genericError} <red><bold>Completed with $err in $time</red></bold>`, {
          err: conj('error', this._errors.length),
          time: `1s`,
        }),
      );
    } else if (hasWarnings) {
      this.log(
        'bottom_message',
        this.getString(
          this.indent +
            '@warning <white><bold><bgYellow> WARNING </bgYellow></bold></white>  <yellow><bold>Completed with $err in $time</yellow></bold>',
          {
            warn: conj('warning', this._warnings.length),
            time: `1s`,
          },
        ),
      );
    } else {
      this.log(
        'bottom_message',
        this.getString(this.indent + `@success <green><bold>Completed without build issues in $time</bold></green>`, {
          time: `1s`,
        }),
      );
    }
  }
}

export function createLog(props: IFuseBoxLogProps): FuseBoxLogAdapter {
  return new FuseBoxLogAdapter(props);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getWord(min: number, max: number) {
  const lorem =
    'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur';

  const amount = getRandomInt(min, max);
  const words = lorem.split(' ');
  let data = [];
  for (let i = 0; i <= amount; i++) {
    const pos = getRandomInt(0, words.length);
    data.push(words[pos]);
  }
  return data.join(' ');
}

async function generateStream(fn: (data: string) => void) {
  async function delay() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve();
      }, getRandomInt(20, 70));
    });
  }
  let iterations = 15;
  let list = [];
  for (let i = 0; i < iterations; i++) {
    list.push(getWord(2, 10));
  }
  for (const item of list) {
    await delay();
    fn(item);
  }
}

const log = createLog({});
log.fuseHeader({ version: '4.0.0', mode: 'development', entry: __filename });

async function foo() {
  await generateStream(data => {
    log.info('assemble', data);
    if (getRandomInt(1, 20) === 10) {
      //log.warn(getWord(2, 10));
    }
    if (getRandomInt(1, 20) === 10) {
      //log.error(getWord(2, 10));
    }
  });

  await generateStream(data => {
    log.info('transpile', data);
    if (getRandomInt(1, 20) === 10) {
      //log.warn(getWord(2, 10));
    }
  });
  //log.error(getWord(2, 10));

  log.fuseFinalise();
  //log.echo('\n');
  // log.meta('development', 'Server is running on port 4444');
  // log.meta('development', 'Watching for changes');
}

foo();
