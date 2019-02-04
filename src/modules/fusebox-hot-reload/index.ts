import { SocketClient } from "../fusebox-websocket";
import { resolve } from "dns";

const Client: typeof SocketClient = require("fusebox-websocket").SocketClient,
	bundleErrors: { [bundleName: string]: string[] } = {},
	outputElement: HTMLDivElement = document.createElement("div"),
	styleElement = document.createElement("style"),
	minimizeToggleId = "fuse-box-toggle-minimized",
	hideButtonId = "fuse-box-hide",
	expandedOutputClass = "fuse-box-expanded-output",
	localStoragePrefix = "__fuse-box_";

function storeSetting(key: string, value: boolean) {
	localStorage[localStoragePrefix + key] = value;
}

function getSetting(key: string) {
	return localStorage[localStoragePrefix + key] === "true" ? true : false;
}

function log(text: string) {
	console.info(`%c${text}`, "color: #237abe");
}

let outputInBody = false,
	outputMinimized = getSetting(minimizeToggleId),
	outputHidden = false;

outputElement.id = "fuse-box-output";
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
    }`;
styleElement.type = "text/css";
document.getElementsByTagName("head")[0].appendChild(styleElement);

function displayBundleErrors() {
	const errorMessages = Object.keys(bundleErrors).reduce((allMessages, bundleName) => {
			const bundleMessages = bundleErrors[bundleName];

			return allMessages.concat(
				bundleMessages.map(message => {
					const messageOutput = message
						.replace(/\n/g, "<br>")
						.replace(/\t/g, "&nbsp;&nbps;&npbs;&nbps;")
						.replace(/ /g, "&nbsp;");
					return `<pre>${messageOutput}</pre>`;
				}),
			);
		}, []),
		errorOutput = errorMessages.join("");

	if (errorOutput && !outputHidden) {
		outputElement.innerHTML = `
        <div class="fuse-box-header" style="">
            <h4 style="">Fuse Box Bundle Errors (${errorMessages.length}):</h4>
            <div style="float: right;">
                <button id="${minimizeToggleId}">${outputMinimized ? "Expand" : "Minimize"}</button>
                <button id="${hideButtonId}">Hide</button>
            </div>
        </div>
        <div class="fuse-box-errors">
            ${errorOutput}
        </div>
        `;

		document.body.appendChild(outputElement);
		outputElement.className = outputMinimized ? "" : expandedOutputClass;
		outputInBody = true;
		document.getElementById(minimizeToggleId).onclick = () => {
			outputMinimized = !outputMinimized;
			storeSetting(minimizeToggleId, outputMinimized);
			displayBundleErrors();
		};
		document.getElementById(hideButtonId).onclick = () => {
			outputHidden = true;
			displayBundleErrors();
		};
	} else if (outputInBody) {
		document.body.removeChild(outputElement);
		outputInBody = false;
	}
}

export const connect = (port: string, uri: string, reloadFullPage: boolean) => {
	if (FuseBox.isServer) {
		return;
	}
	port = port || window.location.port;
	let client = new Client({
		port,
		uri,
	});
	client.connect();
	client.on("page-reload", data => {
		return window.location.reload();
	});
	client.on("page-hmr", data => {
		FuseBox.flush();
		FuseBox.dynamic(data.path, data.content);
		if (FuseBox.mainFile) {
			try {
				FuseBox.import(FuseBox.mainFile);
			} catch (e) {
				if (typeof e === "string") {
					if (/not found/.test(e)) {
						return window.location.reload();
					}
				}
				console.error(e);
			}
		}
	});
	async function getFuseBoxSources() {
		const scriptTags = document.querySelectorAll("script[type='text/javascript']");
		const paths = [];
		scriptTags.forEach(scriptTag => {
			const src = scriptTag.getAttribute("src");
			if (src && !/^http/.test(src)) {
				paths.push(src);
			}
		});
		let content;
		for (const item of paths) {
			const result = await fetch(item);
			const text = await result.text();
			content += "\n" + text;
		}
		const re = /\/* fuse:start-collection "([@.\/a-z0-9_-]+)"\*\//gim;
		let m;
		const collectionNames = [];
		while ((m = re.exec(content))) {
			m[1] && collectionNames.push(m[1]);
		}
		const packages = [];
		collectionNames.map(name => {
			const start = new RegExp(
				`\\/\\* fuse:start-collection "${name}"\\*\\/([\\s\\S]+)\\/\\* fuse:end-collection "${name}"\\*\\/`,
				"im",
			);
			const contents = content.match(start);
			packages[name] = contents[1];
		});
		return packages;
	}

	async function updateVendors() {
		log(`Getting fresh scripts ...`);
		const packages = await getFuseBoxSources();
		log(`Updating ${Object.keys(packages).length} vendors.`);
		const excludedPackages = ["default", "fusebox-hot-reload", "fusebox-websocket"];
		for (const packageName in packages) {
			if (excludedPackages.indexOf(packageName) === -1) {
				const js = packages[packageName];
				// flush package from memeory
				delete FuseBox.packages[packageName];
				new Function(js)(true);
			}
		}
		log(`Vendors synchronized!`);
	}

	client.on("dependency-update", async input => {
		if (input.vendors && input.vendors.length) {
			log(`Vendor update required ...`);
			await updateVendors();
		}
		if (input && input.files && input.files.length) {
			input.files.map(item => {
				if (item.path && item.package && item.content) {
					const fullPath = `${item.package}/${item.path}`;
					log(`Update "${fullPath}"`);
					FuseBox.consume(item.content);
				}
			});
		}

		if (input.originalHMRRequest) {
			return onSourceChanged(input.originalHMRRequest, true);
		}
	});

	function onSourceChanged(data, secondaryRequest?) {
		log(`Update "${data.path}"`);
		if (reloadFullPage) {
			return window.location.reload();
		}

		// we should verify that all dependencies are registered in FuseBox client's memory
		if (data.type && data.type === "js" && data.dependencies) {
			const req = {
				original: data,
				loadedPackages: [],
				files: [],
			};
			for (const pkgName in FuseBox.packages) {
				req.loadedPackages.push(pkgName);
			}
			data.dependencies.map(item => {
				if (item.path && item.module) {
					if (!FuseBox.exists(`${item.module}/${item.path}`)) {
						req.files.push(item);
					}
				}
			});

			if (req.files.length) {
				if (!secondaryRequest) {
					log("Sending request for missing dependencies " + req.files.map(i => `${i.module}/${i.path}`));
					client.send("request-dependency", JSON.stringify(req));
					// should not proceed here
					return;
				} else {
					log("Error occured while updating dependency with list " + req.files.map(i => `${i.module}/${i.path}`));
				}
			}
		}

		/**
		 * If a plugin handles this request then we don't have to do anything
		 **/
		for (var index = 0; index < FuseBox.plugins.length; index++) {
			var plugin = FuseBox.plugins[index];
			if (plugin.hmrUpdate && plugin.hmrUpdate(data, client)) {
				return;
			}
		}

		if (data.type === "hosted-css") {
			var fileId = data.path.replace(/^\//, "").replace(/[\.\/]+/g, "-");
			var existing = document.getElementById(fileId);
			if (existing) {
				existing.setAttribute("href", data.path + "?" + new Date().getTime());
			} else {
				var node = document.createElement("link");
				node.id = fileId;
				node.type = "text/css";
				node.rel = "stylesheet";
				node.href = data.path;
				document.getElementsByTagName("head")[0].appendChild(node);
			}
		}
		if (data.type === "js") {
			FuseBox.flush();
			FuseBox.consume(data.content);
			if (FuseBox.mainFile) {
				FuseBox.import(FuseBox.mainFile);
			}
		}
		if (data.type === "css") {
			FuseBox.flush();
			FuseBox.dynamic(data.path, data.content);
			if (FuseBox.mainFile) {
				FuseBox.import(FuseBox.mainFile);
			}
		}
	}

	client.on("source-changed", data => {
		onSourceChanged(data);
	});

	client.on("error", error => {
		console.log(error);
	});
	client.on("bundle-error", ({ bundleName, message }: { bundleName: string; message: string }) => {
		console.error(`Bundle error in ${bundleName}: ${message}`);

		const errorsForBundle = bundleErrors[bundleName] || [];
		errorsForBundle.push(message);
		bundleErrors[bundleName] = errorsForBundle;

		displayBundleErrors();
	});
	client.on("update-bundle-errors", ({ bundleName, messages }: { bundleName: string; messages: string[] }) => {
		messages.forEach(message => console.error(`Bundle error in ${bundleName}: ${message}`));
		bundleErrors[bundleName] = messages;
		displayBundleErrors();
	});
};
