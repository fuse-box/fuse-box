/**
 * @module listens to `source-changed` socket events and actions hot reload
 */

import { SocketClient } from '../fusebox-websocket';
const Client: typeof SocketClient = require('fusebox-websocket').SocketClient,
  bundleErrors: { [bundleName: string]: string[] } = {},
  outputElement: HTMLDivElement = document.createElement('div')
let outputInBody = false

outputElement.style.zIndex = '999999999999';
outputElement.style.position = 'fixed';
outputElement.style.top = '10px';
outputElement.style.left = '10px';
outputElement.style.right = '10px';
outputElement.style.maxHeight = 'calc(100vh - 50px)';
outputElement.style.overflow = 'auto';
outputElement.style.backgroundColor = '#fdf3f1';
outputElement.style.border = '1px solid #f8d3cb';
outputElement.style.padding = '10px';
outputElement.style.borderRadius = '5px';
outputElement.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';

function displayBundleErrors() {
    const output = Object.keys(bundleErrors).reduce((acc, bundleName) => {
        const messages = bundleErrors[bundleName]

        return acc + messages.map(message => {
            const messageOutput = message
              .replace(/\n/g, '<br>')
              .replace(/\t/g, '&nbsp;&nbps;&npbs;&nbps;')
              .replace(/ /g, '&nbsp;')
            return `<pre>${messageOutput}</pre>`
        }).join('')
    }, '')

    if (output) {
        outputElement.innerHTML = '<p>Fuse Box Bundle Errors:</p>' + output

        document.body.appendChild(outputElement)
        outputInBody = true
    } else if (outputInBody) {
        document.body.removeChild(outputElement)
        outputInBody = false
    }
}

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
    client.on('bundle-error', ({ bundleName, message }: { bundleName: string, message: string }) => {
        console.error(`Bundle error in ${bundleName}: ${message}`)

        const errorsForBundle = bundleErrors[bundleName] || []
        errorsForBundle.push(message)
        bundleErrors[bundleName] = errorsForBundle

        displayBundleErrors()
    })
    client.on('clear-bundle-errors', ({ bundleName }: { bundleName: string }) => {
        delete bundleErrors[bundleName]
        displayBundleErrors()
    })
};
