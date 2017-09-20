import { File } from "../core/File";
import { WorkFlowContext, Plugin } from "../core/WorkflowContext";
import { Concat } from "../Utils";
import * as fs from "fs";
import * as path from "path";
// import * as hash from 'shorthash';

const typescriptTranspiler = require("typescript");
const vueCompiler = require("vue-template-compiler");
const vueTranspiler = require("vue-template-es2015-compiler");
// const consolidate = require('consolidate');

function getDefaultExtension(block) {
  switch (block.type) {
    case 'template':
      return 'html';
    case 'script':
      return 'js';
    case 'style':
      return 'css';
  }
}

function getFakeExtension(block) {
  switch (block.type) {
    case 'template':
      return 'vue-template';
    case 'script':
      return 'vue-script';
    case 'style':
      return 'vue-style';
  }
}

function getExternalFilePath(file: File, block: any) {
  const extension = !block.src ? getDefaultExtension(block) : path.extname(block.src) || block.lang || getDefaultExtension(block);
  const fakeExtension = getFakeExtension(block);
  const fileName = block.src ? block.src.substr(block.src.lastIndexOf('.') + 1) : block.type;
  const blockFileName = `${fileName}.${extension}`;
  const fakeBlockFileName = `${fileName}.${fakeExtension}`;
  const fuseBoxDirPath = file.info.fuseBoxPath.substr(0, file.info.fuseBoxPath.lastIndexOf('/') + 1);

  return {
    fuseBoxPath: `~/${file.collection.pm.getFuseBoxPath(path.join(fuseBoxDirPath, fakeBlockFileName), file.context.appRoot)}`,
    absPath: file.collection.pm.getAbsolutePath(path.join(file.info.absDir, blockFileName), file.info.absDir).resolved
  };
}

async function processBlock(concat: Concat, file: File, block) {
  const filePath = getExternalFilePath(file, block);
  const blockFile = new File(file.context, file.collection.pm.resolve(filePath.fuseBoxPath, file.info.absDir));

  blockFile.isLoaded = true;
  blockFile.info.absPath = filePath.absPath;
  concat.add(null, `var ${block.type} = require('${filePath.fuseBoxPath}');`);

  if (block.src) {
    blockFile.contents = fs.readFileSync(blockFile.info.absPath).toString();
  } else {
    blockFile.contents = block.content;
  }

  return file.collection.resolve(blockFile);
}

export class VueTemplatePlugin implements Plugin {
  public test: RegExp = /\.vue-template$/;

  public init(context: WorkFlowContext) {
    context.allowExtension(".vue-template");
  }

  public async transform(file: File) {
    file.contents = vueTranspiler(`function render () {${vueCompiler.compile(file.contents).render}}`);
  }
}

export class VueScriptPlugin implements Plugin {
  public test: RegExp = /\.vue-script$/;

  public init(context: WorkFlowContext) {
    context.allowExtension(".vue-script");
  }

  public async transform(file: File) {
    const transpiledContent = typescriptTranspiler.transpileModule(file.contents, file.context.getTypeScriptConfig());
    file.contents = transpiledContent.outputText;
    file.analysis.parseUsingAcorn();
    file.analysis.analyze();
  }
}

export class VueComponentClass implements Plugin {
  public test: RegExp = /\.vue$/;

  public init(context: WorkFlowContext) {
    context.allowExtension(".vue");
  }

  public async transform(file: File) {
    file.loadContents();

    const component = vueCompiler.parseComponent(file.contents);
    const concat = new Concat(true, "", "\n");

    if (component.script) {
      await processBlock(concat, file, component.script);
    }

    if (component.template) {
      await processBlock(concat, file, component.template);
    }

    // if (component.styles && component.styles.length > 0) {
    //   for (let styleBlock of component.styles) {
    //       await processStyle(concat, file, styleBlock);
    //   }
    // }

    file.contents = concat.content.toString();
  }
}

export const VueComponentPlugin = () => {
    return [[new VueComponentClass()], new VueScriptPlugin(), new VueTemplatePlugin()];
};
