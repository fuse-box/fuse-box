/**
 * @module listens to `source-changed` socket events and actions hot reload
 */

import { SocketClient } from '../fusebox-websocket';
const Client: typeof SocketClient = require('fusebox-websocket').SocketClient;

export const connect = (port: string, uri: string) => {

    if (FuseBox.isServer) {
        return;
    }
    port = port || window.location.port;
    let client = new Client({
        port,
        uri,
    });
    client.connect();


    client.on('source-changed', (data) => {
        console.info(`%cupdate "${data.path}"`, 'color: #237abe');

        if (data.type === "hosted-css") {
            var fileId = data.path.replace(/[\.\/]+/g, '-')
            var existing = document.getElementById(fileId);
            if (existing) {
                existing.setAttribute("href", data.path + "?" + new Date().getTime());
            } else {
                var node = document.createElement('link');
                node.id = fileId;
                node.type = 'text/css';
                node.rel = 'stylesheet';
                node.href = data.path;
                document.getElementsByTagName('head')[0].appendChild(node);
            }
        }

        /**
         * If a plugin handles this request then we don't have to do anything
         **/
        for (var index = 0; index < FuseBox.plugins.length; index++) {
            var plugin = FuseBox.plugins[index];
            if (plugin.hmrUpdate && plugin.hmrUpdate(data)) {
                return;
            }
        }


        if (data.type === 'js' || data.type === "css") {
            FuseBox.flush();
            FuseBox.dynamic(data.path, data.content);
            if (FuseBox.mainFile) {
                try {
                    FuseBox.import(FuseBox.mainFile);
                } catch (e) {
                    if (typeof e === 'string') {
                        if (/not found/.test(e)) {
                            return window.location.reload();
                        }
                    }
                    console.error(e);
                }
            }
        }
    });
    client.on('error', (error) => {
        console.log(error);
    });
};
