## Changes

### Electron

Polyfilling is removed for electron. You will have to do it yourself. This happened because `nodeIntegration` is
recommended to be set to `false`. And it won't work in Electron 8
