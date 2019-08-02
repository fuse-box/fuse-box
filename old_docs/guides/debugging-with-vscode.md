---
id: debugging-with-vscode
title: Debugging with VS Code
---

[Visual Studo Code](https://code.visualstudio.com/) is a light weight editor,
with excellent debugging support. In this guide you'll be shown on how to get
debugging working with `fuse-box` on both web apps and node applications. The
source code for this example application can be found
[here](https://github.com/andrew-w-ross/fuse-debug).

The source code structure should look as follows:

```
src +
  - client +
    - components +
      - Adder.tsx
      - Main.tsx
      - ServerCaps.tsx
    - index.tsx
  - server +
     - index.ts
```

## Browser Debugging

Make sure the
[debugger for chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
is installed. Then Start up fuse box by running `npm start` in the terminal and
wait for the `Listening @ http://localhost:3000` message. In vscode open the
debug panel and select the `Launch Chrome` configuration from the drop down and
launch by pressing `f5`.

Add a break point to either the `render` or `add` function in the `Adder.tsx`
and hit the Click Me button. It should break as demoed below:

![debugging gif](https://raw.githubusercontent.com/fuse-box/fuse-box/master/docs/images/debugging.gif)

### How mapping works

Open the mapping file for the client in `dist/public/client.js.map`. You should
see the following :

```json
{
	"version":3,
	"sources":[
		"/src/client/index.tsx",
		"/src/client/components/Main.tsx",
		"/src/client/components/Adder.tsx",
		"/src/client/components/ServerCaps.tsx"
	],
	"names":[],
	"mappings":<-- Snipped -->
}
```

To get `vscode` to map the sources to the source files on your computer we need
to map the `/` to the root folder of the workspace. Open the launch configurtion
in `.vscode/launch.json`.

```json
{
  "type": "chrome",
  "request": "launch",
  "name": "Launch Chrome",
  "url": "http://localhost:3000",
  "webRoot": "${workspaceRoot}",
  "sourceMapPathOverrides": {
    "/*": "${webRoot}/*"
  }
}
```

The `sourceMapPathOverrides` will map any source starting with `/` to the root
folder of the workspace using
[Variable substitution](https://code.visualstudio.com/docs/editor/debugging#_variable-substitution).
If you are having trouble mapping the sources to your local files use the
`.scripts` command in the debug console.

## Server Debugging

Let's get into full stack development by debugging the server with the client.
Go back to the debug panel and choose the `Attach Server` option and launch
another debugging instance. There should be a dropdown in the debug menu at the
top letting you switch between the two debug contexts. Add a breakpoint to line
21 of `ServerCaps.tsx` in client, also add a breakpoint to line 19 of `index.ts`
in server. Hit the `Send to Server` button and you should see the context switch
as the code goes from `client` -> `Server` -> `Client`.

![fullstack debugging gif](https://raw.githubusercontent.com/fuse-box/fuse-box/master/docs/images/fullstack-debugging.gif)

To debug the server instance it must be launched in the same process that
`fuse-box` is using. To do this use the `require` function on `completed`. When
doing this `fuse-box` needs to know how to close down the process by providing
it a close function.

```js
fuse
  .bundle("server")
  .instructions(">[server/index.ts]")
  .target("server@es2017")
  .watch("src/server/**")
  .hmr()
  .completed(proc => {
    proc.require({
      close: ({ FuseBox }) => FuseBox.import(FuseBox.mainFile).shutdown(),
    });
  });
```
