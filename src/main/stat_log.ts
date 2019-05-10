import { Context } from '../core/Context';
import { env } from '../env';
import { Package } from '../core/Package';

export interface IStatLogProps {
  ctx: Context;
  time: string;
  packages: Array<Package>;
  printFuseBoxVersion?: boolean;
  printPackageStat?: boolean;
}

function conj(word, amount?: number) {
  return amount === 1 ? `1 ${word}` : `${amount} ${word}s`;
}
export function statLog(props: IStatLogProps) {
  const ctx = props.ctx;
  const log = ctx.log;
  if (props.printFuseBoxVersion) {
    log.print('⚙  FuseBox <bold>$version</bold>', {
      version: env.VERSION,
    });
  }

  if (!log.hasErrors() && !log.hasWarnings()) {
    log.print(`<green>✔</green> <green> Completed without issues in <bold>$time</bold></green>`, {
      time: props.time,
    });
  }
  if (log.hasErrors() || log.hasWarnings()) {
    const errs = log.getErrors().length;
    const warns = log.getWarnings().length;

    if (log.hasErrors() && log.hasWarnings()) {
      log.print(`❌<red> Completed with $err and $warn in <bold>$time</bold></red>`, {
        err: conj('error', errs),
        warn: conj('warning', warns),
        time: props.time,
      });
    } else if (log.hasErrors()) {
      log.print(`❌<red> Completed with $err in <bold>$time</bold></red>`, {
        time: props.time,
        err: conj('error', errs),
      });
    } else if (log.hasWarnings()) {
      log.print(`⚠️  <yellow>Completed with <bold>$warn</bold> in <bold>$time</bold></yellow>`, {
        time: props.time,
        warn: conj('warning', warns),
      });
    }
  }
  if (props.printPackageStat) {
    let totalFiles = 0;
    props.packages.forEach(pkg => {
      totalFiles += pkg.modules.length;
    });
    ctx.log.print(`<dim>$packages packages with $files files</dim>`, {
      packages: props.packages.length,
      files: totalFiles,
    });
  }

  setTimeout(() => {
    //ctx.log.printNewLine();
    ctx.log.printWarnings();
    ctx.log.printErrors();
  }, 0);
}
