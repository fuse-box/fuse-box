/**
 * @module listens to `source-changed` socket events and actions hot reload
 */

import { SocketClient } from '../fusebox-websocket';
const Client: typeof SocketClient = require('fusebox-websocket').SocketClient,
  bundleErrors: { [bundleName: string]: string[] } = {},
  outputElement: HTMLDivElement = document.createElement('div'),
  styleElement = document.createElement('style'),
  minimizeToggleId = 'fuse-box-toggle-minimized',
  hideButtonId = 'fuse-box-hide',
  expandedOutputClass = 'fuse-box-expanded-output',
  localStoragePrefix = '__fuse-box_'

function storeSetting (key: string, value: boolean) {
    localStorage[localStoragePrefix + key] = value
}

function getSetting (key: string) {
    return localStorage[localStoragePrefix + key] === 'true' ? true : false
}

let outputInBody = false,
  outputMinimized = getSetting(minimizeToggleId),
  outputHidden = false

outputElement.id = 'fuse-box-output'
styleElement.innerHTML = `
    #${outputElement.id}, #${outputElement.id} * {
        box-sizing: border-box;
    }
    #${outputElement.id} {
        z-index: 999999999999;
        position: fixed;
        top: 10px;
        right: 10px;
        width: 400px;
        overflow: auto;
        background: #fdf3f1;
        border: 1px solid #eca494;
        border-radius: 5px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        box-shadow: 0px 3px 6px 1px rgba(0,0,0,.15);
    }
    #${outputElement.id}.${expandedOutputClass} {
        height: auto;
        width: auto;
        left: 10px;
        max-height: calc(100vh - 50px);
    }
    #${outputElement.id} .fuse-box-errors {
        display: none;
    }
    #${outputElement.id}.${expandedOutputClass} .fuse-box-errors {
        display: block;
        border-top: 1px solid #eca494;
        padding: 0 10px;
    }
    #${outputElement.id} button {
        border: 1px solid #eca494;
        padding: 5px 10px;
        border-radius: 4px;
        margin-left: 5px;
        background-color: white;
        color: black;
        box-shadow: 0px 2px 2px 0px rgba(0,0,0,.05);
    }
    #${outputElement.id} .fuse-box-header {
        padding: 10px;
    }
    #${outputElement.id} .fuse-box-header h4 {
        display: inline-block;
        margin: 4px;
    }`
styleElement.type = 'text/css'
document.getElementsByTagName('head')[0].appendChild(styleElement)

function displayBundleErrors() {
    const errorMessages = Object.keys(bundleErrors).reduce((allMessages, bundleName) => {
            const bundleMessages = bundleErrors[bundleName]

            return allMessages.concat(bundleMessages.map(message => {
                const messageOutput = message
                  .replace(/\n/g, '<br>')
                  .replace(/\t/g, '&nbsp;&nbps;&npbs;&nbps;')
                  .replace(/ /g, '&nbsp;')
                return `<pre>${messageOutput}</pre>`
            }))
        }, []),
        errorOutput = errorMessages.join('')

    if (errorOutput && !outputHidden) {
        outputElement.innerHTML = `
        <div class="fuse-box-header" style="">
            <h4 style="">Fuse Box Bundle Errors (${errorMessages.length}):</h4>
            <div style="float: right;">
                <button id="${minimizeToggleId}">${outputMinimized ? 'Expand' : 'Minimize'}</button>
                <button id="${hideButtonId}">Hide</button>
            </div>
        </div>
        <div class="fuse-box-errors">
            ${errorOutput}
        </div>
        `

        document.body.appendChild(outputElement)
        outputElement.className = outputMinimized ? '' : expandedOutputClass
        outputInBody = true
        document.getElementById(minimizeToggleId).onclick = () => {
            outputMinimized = !outputMinimized
            storeSetting(minimizeToggleId, outputMinimized)
            displayBundleErrors()
        }
        document.getElementById(hideButtonId).onclick = () => {
            outputHidden = true
            displayBundleErrors()
        }
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

        /**
         * If a plugin handles this request then we don't have to do anything
         **/
        for (var index = 0; index < FuseBox.plugins.length; index++) {
            var plugin = FuseBox.plugins[index];
            if (plugin.hmrUpdate && plugin.hmrUpdate(data)) {
                return;
            }
        }

        if (data.type === "hosted-css") {
            var fileId = data.path.replace(/^\//, '').replace(/[\.\/]+/g, '-');
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
    client.on('update-bundle-errors', ({ bundleName, messages }: { bundleName: string, messages: string[] }) => {
        messages.forEach(message => console.error(`Bundle error in ${bundleName}: ${message}`))
        bundleErrors[bundleName] = messages
        displayBundleErrors()
    })
};
