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

export class VuePluginTest {
    "Should return compiled vue code with render functions"() {
        return createEnv({
            project: {
                files: {
					"app.vue": vueFileSource
                },
                plugins: [
                    [ VuePlugin(), RawPlugin({})]
                ],
                instructions: ">app.vue",
            },
        }).then((result) => {
			const out = result.project.FuseBox.import("./app.vue").trim();
			should(out).findString('_p.render');
			should(out).findString('_p.staticRenderFns');
			should(out).notFindString('_p.template');

			should(out).equal(`var _p = {};
var _v = function(exports){"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'app',
    data: function () {
        return {
            msg: 'Welcome to Your Vue.js App'
        };
    }
};
};
_p.render = function render () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('p',[_vm._v(_vm._s(_vm.msg))]),_vm._v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(_vm.msg),expression:"msg"}],attrs:{"type":"text"},domProps:{"value":(_vm.msg)},on:{"input":function($event){if($event.target.composing){ return; }_vm.msg=$event.target.value}}})])}
_p.staticRenderFns = [  ];
var _e = {}; _v(_e); _p = Object.assign(_e.default, _p)
module.exports =_p`);
        });
    }

}
