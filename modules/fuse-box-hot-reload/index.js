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
    let styleSheetUpdate = false;
    if (FuseBox.reloadEntryOnStylesheet && payload.modules.length === 1 && payload.modules[0].isStylesheet) {
      styleSheetUpdate = payload.modules[0];
    }
    payload.modules.forEach(item => {
      // execute in the scope
      new Function(item.content)();
      log(`✔ module hmr: ${item.fuseBoxPath}`);
    });
    payload.packages.forEach(item => {
      new Function(item.content)();
      log(`✔ package hmr: ${item.name}`);
    });

    if (styleSheetUpdate) {
      log(`✔ css reload of: ${styleSheetUpdate.fuseBoxPath}`);
      FuseBox.flush(file => `default/${file}` === styleSheetUpdate.fuseBoxPath);
      // import only css
      FuseBox.import(styleSheetUpdate.fuseBoxPath);
    } else {
      log(`✔ entry reload of: ${FuseBox.mainFile}`);
      FuseBox.flush();
      FuseBox.import(FuseBox.mainFile);
    }
  });
};
