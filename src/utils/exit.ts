const handlers = {};
export function onExit(name: string, exitHandler: (type: string) => void) {
  handlers[name] = exitHandler;
}

function globalExitHandler(type: string, e) {
  for (const key in handlers) {
    handlers[key](type);
  }
  if (type === 'uncaughtException') {
    console.error(e);
  }

  if (type === 'exit') {
    process.exit();
  }
}
process.on('exit', e => globalExitHandler('cleanup', e));
process.on('SIGINT', e => globalExitHandler('exit', e));
process.on('SIGUSR1', e => globalExitHandler('exit', e));
process.on('SIGUSR2', e => globalExitHandler('exit', e));
process.on('uncaughtException', e => globalExitHandler('uncaughtException', e));
