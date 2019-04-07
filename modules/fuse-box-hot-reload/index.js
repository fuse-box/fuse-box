import { SocketClient } from 'fuse-box-websocket';
function log(text) {
  console.info(`%c${text}`, 'color: #237abe');
}

function gatherSummary() {
  const summary = {};
  for (const packageName in FuseBox.packages) {
    const files = FuseBox.packages[packageName].f;
    summary[packageName] = [];
    for (const fuseBoxPath in files) {
      summary[packageName].push(fuseBoxPath);
    }
  }
  return summary;
}
export const connect = opts => {
  let client = new SocketClient({
    port: opts.port,
    uri: opts.uri,
  });
  client.connect();

  client.on('get-summary', data => {
    const { id } = data;
    const summary = gatherSummary();

    client.send('summary', { id, summary });
  });

  client.on('hmr', payload => {
    payload.modules.forEach(item => {
      // execute in the scope
      new Function(item.content)();
      log(`✔ module hmr: ${item.fuseBoxPath}`);
    });
    payload.packages.forEach(item => {
      new Function(item.content)();
      log(`✔ package hmr: ${item.name}`);
    });
    FuseBox.flush();
    FuseBox.import(FuseBox.mainFile);
  });
};
