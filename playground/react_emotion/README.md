# fuse-box-plugin-emotion

> FuseBox plugin for the minification and optimization of emotion styles.

`plugin-emotion` is highly recommended, but not required in version 8 and
above of `emotion`.

## Features

<table>
  <thead>
    <tr>
      <th>Feature/Syntax</th>
      <th>Native</th>
      <th>FuseBox Plugin Required</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>css``</code></td>
      <td align="center">✅</td>
      <td align="center"></td>
      <td></td>
    </tr>
    <tr>
      <td><code>css(...)</code></td>
      <td align="center">✅</td>
      <td align="center"></td>
      <td>Generally used for object styles.</td>
    </tr>
    <tr>
      <td>components as selectors</td>
      <td align="center"></td>
      <td align="center">✅</td>
      <td>Allows an emotion component to be <a href="https://emotion.sh/docs/styled#targeting-another-emotion-component">used as a CSS selector</a>.</td>
    </tr>
    <tr>
      <td>Minification</td>
      <td align="center"></td>
      <td align="center">✅</td>
      <td>Any leading/trailing space between properties in your <code>css</code> and <code>styled</code> blocks is removed. This can reduce the size of your final bundle.</td>
    </tr>
    <tr>
      <td>Dead Code Elimination</td>
      <td align="center"></td>
      <td align="center">✅</td>
      <td>Uglifyjs will use the injected <code>/*#__PURE__*/</code> flag comments to mark your <code>css</code> and <code>styled</code> blocks as candidates for dead code elimination.</td>
    </tr>
    <tr>
      <td>Source Maps</td>
      <td align="center"></td>
      <td align="center">✅</td>
      <td>When enabled, navigate directly to the style declaration in your javascript file.</td>
    </tr>
    <tr>
      <td>Contextual Class Names</td>
      <td align="center"></td>
      <td align="center">✅</td>
      <td>Generated class names include the name of the variable or component they were defined in.</td>
    </tr>
  </tbody>
</table>



## Installation
It's shipped as part of the fusebox core package. Just enable it in your fuse configuration file.

```javascript
import { pluginEmotion } from "fuse-box";

fusebox({
  plugins: [
    pluginEmotion({
      autoInject: true,
      target: /\.(js|jsx|ts|tsx)$/,
      sourceMap: !this.isProduction,
      autoLabel: !this.isProduction,
      labelFormat: "[local]",
      cssPropOptimization: true
    })
  ]
});
```
