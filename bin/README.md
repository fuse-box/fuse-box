1. Instructions
___

```shell
bin: npm i | yarn
bin: touch github-config.ts
bin: code github-config.ts
```
add following code into:

```js
export class GithubConfig{
    static token = 'token'; // oauth
    static username = 'username'; // basicAuth
    static password = 'secret'; // basicAuth
}
```

start building/watching

```shell

bin: npm start

```

run
@todo


Vscode Launch task for debugging

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Changelog",
      "args": [
        "-B"
      ],
      "program": "${workspaceRoot}/bin/changelog/changelog.js",
      "cwd": "${workspaceRoot}/bin",
      "outFiles": []
    }
  ]
}
```
