# Tips

below are some tips that will improve your experience and help you  avoiding gotchas while using **FuseBox**.

## General
* Don't import **FuseBox** in your code, it will cause issues, it is already added to your bundle and available globally.
* Use the `EnvPlugin` to pass Environmental variables on both client and server, you can even use packages like [safe-env](https://www.npmjs.com/package/safe-env) with it.
* **FuseBox** `API` has neat `isServer` and `isBrowser` methods, use them to check the environment the code is running in. an example `FuseBox.isServer` will return `true` if you are running your code in `Node.js`

## TypeScript
* **TypeScript** can automatically infer file extension if it is `.ts` or `.tsx` but if it is `.js`, Make sure to always add the `.js` extension when you require or import that file  as **TypeScript** requires it.
