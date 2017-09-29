import { VueComponentPlugin, BabelPlugin, HTMLPlugin, SassPlugin } from "../../index";
import { createEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";

const getTemplateBlock = (langAttribute: string = '', testIdentifer: string = '') => `
<template ${langAttribute}>
    <div>
        <p class="msg">{{ msg }} - ${testIdentifer}</p>
        <input type="text" v-model="msg" />
    </div>
</template>`;

const getScriptBlock = (langAttribute: string = '') => `
<script ${langAttribute}>
    export default {
        name: 'app',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>`;

const getStyleBlock = (langAttribute: string = '', isScoped: boolean = false) => `
<style ${langAttribute} ${isScoped ? 'scoped' : ''}>
  .msg {
    color: green;
  }
</style>`;

export class VuePluginTest {
    "Should compile with no lang attributes or plugins"() {
        return createEnv({
            project: {
                files: {
                    "app.vue": `${getTemplateBlock('', 'DefaultValues')}${getScriptBlock()}${getStyleBlock()}`
                },
                plugins: [VueComponentPlugin()],
                instructions: "app.vue"
            },
        }).then((result) => {
          const Vue = require('vue')
          const renderer = require('vue-server-renderer').createRenderer()
          const component = result.project.FuseBox.import('./app.vue').default;
          const app = new Vue(component)

          should(component.render).notEqual(undefined);
          should(component.staticRenderFns).notEqual(undefined);

          renderer.renderToString(app, (err, html) => {
            should(html).findString('<p class="msg">Welcome to Your Vue.js App - DefaultValues</p>');
            should(html).findString('<input type="text" value="Welcome to Your Vue.js App">');
          })
        });
    }

    "Should compile with custom lang attributes"() {
        return createEnv({
            project: {
                files: {
                    "app.vue": `${getTemplateBlock('lang="html"', 'LangAttributes')}${getScriptBlock('lang="coffee"')}${getStyleBlock('lang="scss"')}`
                },
                plugins: [VueComponentPlugin()],
                instructions: "app.vue",
            },
        }).then((result) => {
          const Vue = require('vue')
          const renderer = require('vue-server-renderer').createRenderer()
          const component = result.project.FuseBox.import('./app.vue').default;
          const app = new Vue(component)

          should(component.render).notEqual(undefined);
          should(component.staticRenderFns).notEqual(undefined);

          renderer.renderToString(app, (err, html) => {
            should(html).findString('<p class="msg">Welcome to Your Vue.js App - LangAttributes</p>');
            should(html).findString('<input type="text" value="Welcome to Your Vue.js App">');
          })
        });
    }

    "Should use plugin chain from user options"() {
        return createEnv({
            project: {
                files: {
                    "app.vue": `${getTemplateBlock('', 'PluginChain')}${getScriptBlock()}${getStyleBlock()}`
                },
                plugins: [VueComponentPlugin({
                  script: BabelPlugin(),
                  style: SassPlugin(),
                  template: HTMLPlugin()
                })],
                instructions: "app.vue",
            },
        }).then((result) => {
          const Vue = require('vue')
          const renderer = require('vue-server-renderer').createRenderer()
          const component = result.project.FuseBox.import('./app.vue').default;
          const app = new Vue(component)

          should(component.render).notEqual(undefined);
          should(component.staticRenderFns).notEqual(undefined);

          renderer.renderToString(app, (err, html) => {
            should(html).findString('<p class="msg">Welcome to Your Vue.js App - PluginChain</p>');
            should(html).findString('<input type="text" value="Welcome to Your Vue.js App">');
          })
        });
    }

    "Should scope styles when using the 'scoped' attribute"() {
        return createEnv({
            project: {
                files: {
                    "app.vue": `${getTemplateBlock('', 'ScopedStyles')}${getScriptBlock()}${getStyleBlock('', true)}`
                },
                plugins: [VueComponentPlugin({
                  script: BabelPlugin(),
                  style: SassPlugin(),
                  template: HTMLPlugin()
                })],
                instructions: "app.vue",
            },
        }).then((result) => {
          const Vue = require('vue')
          const renderer = require('vue-server-renderer').createRenderer()
          const component = result.project.FuseBox.import('./app.vue').default;
          const app = new Vue(component)

          should(component.render).notEqual(undefined);
          should(component.staticRenderFns).notEqual(undefined);

          renderer.renderToString(app, (err, html) => {
            should(html).findString(component._scopeId);
            should(html).findString('ScopedStyles');
          })
        });
    }
}
