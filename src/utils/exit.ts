const handlers = {};
export function onExit(name: string, exitHandler: (type: string) => void) {
  handlers[name] = exitHandler;
}

function globalExitHandler(type: string) {
  for (const key in handlers) {
    handlers[key](type);
  }

  if (type === 'exit') {
    process.exit();
  }
}
process.on('exit', () => globalExitHandler('cleanup'));
process.on('SIGINT', () => globalExitHandler('exit'));
process.on('SIGUSR1', () => globalExitHandler('exit'));
process.on('SIGUSR2', () => globalExitHandler('exit'));
process.on('uncaughtException', () => globalExitHandler('uncaughtException'));
