import { VueComponentPlugin, BabelPlugin, HTMLPlugin, SassPlugin } from "../../index";
import { createEnv } from "../stubs/TestEnvironment";
import { FuseTestEnv } from "../stubs/FuseTestEnv";
import { should } from "fuse-test-runner";

const getTemplateBlock = (langAttribute: string = "", testIdentifer: string = "") => `
<template ${langAttribute}>
    <div>
        <p class="msg">{{ msg }} - ${testIdentifer}</p>
        <input type="text" v-model="msg" />
    </div>
</template>`;

const getScriptBlock = (langAttribute: string = "") => `
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

const getDecoratorScriptBlock = () => `
<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component({})
  export default class VueClassComponent extends Vue {
  }
</script>`;

const getStyleBlock = (langAttribute: string = "", isScoped: boolean = false) => `
<style ${langAttribute} ${isScoped ? "scoped" : ""}>
  .msg {
    color: green;
  }
</style>`;

export class VuePluginTest {
	"Should compile with no lang attributes or plugins"() {
		return createEnv({
			project: {
				files: {
					"app.vue": `${getTemplateBlock("", "DefaultValues")}${getScriptBlock()}${getStyleBlock()}`,
				},
				plugins: [VueComponentPlugin()],
				instructions: "app.vue",
			},
		}).then(result => {
			const Vue = require("vue");
			const renderer = require("vue-server-renderer").createRenderer();
			const component = result.project.FuseBox.import("./app.vue").default;
			const app = new Vue(component);

			should(component.render).notEqual(undefined);
			should(component.staticRenderFns).notEqual(undefined);

			renderer.renderToString(app, (err, html) => {
				should(html).findString('<p class="msg">Welcome to Your Vue.js App - DefaultValues</p>');
				should(html).findString('<input type="text" value="Welcome to Your Vue.js App">');
			});
		});
	}

	"Should compile with custom lang attributes"() {
		return createEnv({
			project: {
				files: {
					"app.vue": `${getTemplateBlock('lang="html"', "LangAttributes")}${getScriptBlock('lang="ts"')}${getStyleBlock(
						'lang="scss"',
					)}`,
				},
				plugins: [VueComponentPlugin()],
				instructions: "app.vue",
			},
		}).then(result => {
			const Vue = require("vue");
			const renderer = require("vue-server-renderer").createRenderer();
			const component = result.project.FuseBox.import("./app.vue").default;
			const app = new Vue(component);

			should(component.render).notEqual(undefined);
			should(component.staticRenderFns).notEqual(undefined);

			renderer.renderToString(app, (err, html) => {
				should(html).findString('<p class="msg">Welcome to Your Vue.js App - LangAttributes</p>');
				should(html).findString('<input type="text" value="Welcome to Your Vue.js App">');
			});
		});
	}

	"Should compile using Typescript if lang='ts'"() {
		return createEnv({
			project: {
				files: {
					"app.vue": `${getTemplateBlock('lang="html"', "LangAttributes")}${getScriptBlock('lang="ts"')}${getStyleBlock(
						'lang="scss"',
					)}`,
				},
				plugins: [VueComponentPlugin()],
				instructions: "app.vue",
			},
		}).then(result => {
			const Vue = require("vue");
			const renderer = require("vue-server-renderer").createRenderer();
			const component = result.project.FuseBox.import("./app.vue").default;
			const app = new Vue(component);

			should(component.render).notEqual(undefined);
			should(component.staticRenderFns).notEqual(undefined);

			renderer.renderToString(app, (err, html) => {
				should(html).findString('<p class="msg">Welcome to Your Vue.js App - LangAttributes</p>');
				should(html).findString('<input type="text" value="Welcome to Your Vue.js App">');
			});
		});
	}

	"Should use plugin chain from user options"() {
		return createEnv({
			project: {
				files: {
					"app.vue": `${getTemplateBlock("", "PluginChain")}${getScriptBlock()}${getStyleBlock()}`,
				},
				plugins: [
					VueComponentPlugin({
						script: BabelPlugin(),
						style: SassPlugin(),
						template: HTMLPlugin(),
					}),
				],
				instructions: "app.vue",
			},
		}).then(result => {
			const Vue = require("vue");
			const renderer = require("vue-server-renderer").createRenderer();
			const component = result.project.FuseBox.import("./app.vue").default;
			const app = new Vue(component);

			should(component.render).notEqual(undefined);
			should(component.staticRenderFns).notEqual(undefined);

			renderer.renderToString(app, (err, html) => {
				should(html).findString('<p class="msg">Welcome to Your Vue.js App - PluginChain</p>');
				should(html).findString('<input type="text" value="Welcome to Your Vue.js App">');
			});
		});
	}

	"Should scope styles when using the 'scoped' attribute"() {
		return createEnv({
			project: {
				files: {
					"app.vue": `${getTemplateBlock("", "ScopedStyles")}${getScriptBlock()}${getStyleBlock("", true)}`,
				},
				plugins: [
					VueComponentPlugin({
						script: BabelPlugin(),
						style: SassPlugin(),
						template: HTMLPlugin(),
					}),
				],
				instructions: "app.vue",
			},
		}).then(result => {
			const Vue = require("vue");
			const renderer = require("vue-server-renderer").createRenderer();
			const component = result.project.FuseBox.import("./app.vue").default;
			const app = new Vue(component);

			should(component.render).notEqual(undefined);
			should(component.staticRenderFns).notEqual(undefined);

			renderer.renderToString(app, (err, html) => {
				should(html).findString(component._scopeId);
				should(html).findString("ScopedStyles");
			});
		});
	}

	"Should allow extension overrides"() {
		return FuseTestEnv.create({
			project: {
				useTypescriptCompiler: true,
				extensionOverrides: [".foo.ts", ".foo.html", ".foo.css"],
				plugins: [VueComponentPlugin()],
				files: {
					"app.vue": `
                  <template src="./template.html"></template>
                  <script src="./script.ts"></script>
                  <style src="./style.scss"></style>
                `,
					"template.html": "<h1>I should not be included</h1>",
					"template.foo.html": "<h1>I should be included</h1>",
					"script.ts": "export default { message: 'I should not be included' }",
					"script.foo.ts": "export default { message: 'I should be included' }",
					"style.ts": "h1 { color: red; }",
					"style.foo.ts": "h1 { color: blue; }",
				},
			},
		})
			.simple(">app.vue")
			.then(env =>
				env.browser(window => {
					const Vue = require("vue");
					const renderer = require("vue-server-renderer").createRenderer();
					const component = window.FuseBox.import("./app.vue").default;
					const app = new Vue(component);

					should(component.message).equal("I should be included");

					renderer.renderToString(app, (err, html) => {
						should(html).findString("I should be included");
					});
				}),
			);
	}

	"Should be compatible with vue-class-component decorators"() {
		return createEnv({
			project: {
				allowSyntheticDefaultImports: true,
				files: {
					"app.vue": `${getTemplateBlock("", "Decorators")}${getDecoratorScriptBlock()}${getStyleBlock("")}`,
				},
				plugins: [VueComponentPlugin()],
				instructions: "app.vue",
			},
		}).then(result => {
			const Vue = require("vue");
			const renderer = require("vue-server-renderer").createRenderer();
			const component = result.project.FuseBox.import("./app.vue").default.options;
			const app = new Vue(component);

			should(component.render).notEqual(undefined);
			should(component.staticRenderFns).notEqual(undefined);

			renderer.renderToString(app, (err, html) => {
				should(html).findString("Decorators");
			});
		});
	}
}
