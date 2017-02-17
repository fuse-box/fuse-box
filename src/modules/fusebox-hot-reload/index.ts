/**
 * @module listens to `source-changed` socket events and actions hot reload
 */
const Client = require("fusebox-websocket").SocketClient;

export const connect = (port: string) => {

    if (FuseBox.isServer) {
        return;
    }
    port = port || window.location.port;
    let client = new Client({
        port: port
    });
    client.connect();
    console.log("connecting...");
    client.on("source-changed", (data) => {
        console.log(`Updating "${data.path}" ...`);

        /** 
         * If a plugin handles this request then we don't have to do anything
         **/
        for (var index = 0; index < FuseBox.plugins.length; index++) {
            var plugin = FuseBox.plugins[index];
            if (plugin.hmrUpdate && plugin.hmrUpdate(data)) {
                return;
            }
        }

        if (data.type === "js") {
            FuseBox.flush();
            FuseBox.dynamic(data.path, data.content);
            if (FuseBox.mainFile) {
                FuseBox.import(FuseBox.mainFile)
            }
        }
        if (data.type === "css" && __fsbx_css) {
            __fsbx_css(data.path, data.content)
        }
    })
    client.on("error", (error) => {
        console.log(error);
    });
}