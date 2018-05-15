import { VuePlugin, RawPlugin } from "../../index";
import { createEnv } from "../stubs/TestEnvironment";
import { should } from "fuse-test-runner";

const vueFileSource = `<template>
    <div>
        <p>{{ msg }}</p>
        <input type="text" v-model="msg" />
    </div>
</template>

<script>
    export default {
        name: 'app',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>
`;

const vueBabelFileSource = `<template>
    <div>
        <p>{{ msg }}</p>
        <input type="text" v-model="msg" />
    </div>
</template>

<script lang="babel">
    let language = 'Babel';
    export default {
        name: 'app',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App, ' + language
            }
        }
    }
</script>
`;

export class VuePluginTest {
    "Should return compiled TS vue code with render functions"() {
        return createEnv({
            project: {
                files: {
                    "app.vue": vueFileSource
                },
                plugins: [
                    [ VuePlugin() ]
                ],
                instructions: "app.vue",
            },
        }).then((result) => {
            const component = result.project.FuseBox.import('./app.vue').default;

            // //test for render functions
            should( component.render ).notEqual( undefined );
            should( component.staticRenderFns ).notEqual( undefined );

            // //test for not having a template string (would not work with runtime-only-vue)
            should( component.template ).equal( undefined );

            //test html output
            const Vue = require('vue')
            const renderer = require('vue-server-renderer').createRenderer()

            const app = new Vue(component)
            renderer.renderToString(app, (err, html) => {
                should(html).findString('<p>Welcome to Your Vue.js App</p>');
                should(html).findString('<input type="text" value="Welcome to Your Vue.js App">');
            })
        });
    }

    "Should return compiled Babel vue code with render functions"() {
        return createEnv({
            project: {
                files: {
                    "app.vue": vueBabelFileSource
                },
                plugins: [VuePlugin()],
                instructions: "app.vue",
            },
        }).then((result) => {
            const component = result.project.FuseBox.import('./app.vue').default;

            // //test for render functions
            should( component.render ).notEqual( undefined );
            should( component.staticRenderFns ).notEqual( undefined );

            // //test for not having a template string (would not work with runtime-only-vue)
            should( component.template ).equal( undefined );

            //test html output
            const Vue = require('vue')
            const renderer = require('vue-server-renderer').createRenderer()

            const app = new Vue(component)
            renderer.renderToString(app, (err, html) => {
                should(html).findString('<p>Welcome to Your Vue.js App, Babel</p>');
                should(html).findString('<input type="text" value="Welcome to Your Vue.js App, Babel">');
            })
        });
    }

}
