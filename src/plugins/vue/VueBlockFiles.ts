import { File } from "../../core/File";
import { WorkFlowContext, Plugin } from "../../core/WorkflowContext";
import { IPathInformation } from '../../core/PathMaster';
import * as fs from "fs";
const typescriptTranspiler = require("typescript");
const vueTranspiler = require("vue-template-es2015-compiler");
const vueCompiler = require("vue-template-compiler");

export abstract class VueBlockFile extends File {
  constructor(
    public context: WorkFlowContext,
    public info: IPathInformation,
    public block: any,
    public scopeId: string,
    public pluginChain: Plugin[]
  ) {
    super(context, info);
  }

  public loadContents() {
    if (this.isLoaded) {
        return;
    }

    if (this.block.src) {
      this.contents = fs.readFileSync(this.info.absPath).toString();
    } else {
      this.contents = this.block.content;
    }

    this.isLoaded = true;
  }

  public abstract async process(): Promise<string>;
}

export class VueScriptFile extends VueBlockFile {
  public sourceMapText: string;

  public loadContents() {
    super.loadContents();

    const transpiled = typescriptTranspiler.transpileModule(this.contents.trim(), this.context.getTypeScriptConfig());
    const jsonSourceMaps = JSON.parse(transpiled.sourceMapText);

    jsonSourceMaps.sources = [this.info.fuseBoxPath];
    this.sourceMapText = JSON.stringify(jsonSourceMaps);
    this.contents = transpiled.outputText;
  }

  public async process() {
    return Promise.resolve('');
  }
}

export class VueTemplateFile extends VueBlockFile {
  private toFunction (code) {
    return vueTranspiler(`function render () {${code}}`);
  }

  public loadContents() {
    super.loadContents();

    const compiled = vueCompiler.compile(this.contents);

    this.contents = `Object.assign(_options, {
      _scopeId: ${this.scopeId ? JSON.stringify(this.scopeId) : null},
      render: ${this.toFunction(compiled.render)},
      staticRenderFns: [${compiled.staticRenderFns.map((t) => this.toFunction(t)).join(',')}]
    })`;
  }

  public async process() {
    return Promise.resolve('');
  }
}

export class VueStyleFile extends VueBlockFile {
  public async process() {
    return Promise.resolve('');
  }
}
