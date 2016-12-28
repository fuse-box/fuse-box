import { File } from '../File';
import { WorkFlowContext } from '../WorkflowContext';
import { Plugin } from '../WorkflowContext';

import * as UglifyJs from 'uglify-js';

export class UglifyJSPluginClass implements Plugin {
	public test: RegExp = /\.js$/;
	public options: any;

	constructor (options: any) {
		this.options = options || {};
	}

	transform (file: File) {
		file.loadContents();
		file.makeAnalysis();

		let uAst = UglifyJs.AST_Node.from_mozilla_ast(file.analysis.ast);
		
		uAst.figure_out_scope();
		uAst = uAst.transform(UglifyJs.Compressor({}));

		uAst.figure_out_scope();
		uAst.compute_char_frequency();
		uAst.mangle_names();

		const sourceMap = UglifyJs.SourceMap({
			file: file.info.fuseBoxPath,
			root: file.context.homeDir
		});
		const stream = UglifyJs.OutputStream({
			source_map: sourceMap,
		});
		uAst.print(stream);

		const code = stream.toString();

		file.contents = code;
	}

	/*postBundle (context) {
		const options = Object.assign({}, this.options, {fromString: true});
		const concat = context.source.getResult();
		const source = concat.content.toString();
		const sourceMap = concat.sourceMap;
		const result = compressor.minify(source, options);

		context.source.reset();

		const newConcat = context.source.getResult();
		newConcat.add(null, result.code, sourceMap);
	}*/
}

export const UglifyJSPlugin = (options: any) => {
	return new UglifyJSPluginClass(options);
}