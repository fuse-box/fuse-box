import { SocketClient } from 'fuse-box-websocket';
function log(text) {
  console.info(`%c${text}`, 'color: #237abe');
}
export const connect = opts => {
  let client = new SocketClient({
    port: opts.port,
    uri: opts.uri,
  });
  client.connect();
};
