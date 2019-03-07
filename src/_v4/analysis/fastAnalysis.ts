import { tokenize } from "./tokenizer";
//import { AnalysisContext } from "./AnalysisContext";

interface IFastAnalysisProps {
	input: string;
}
export interface IFastAnalysis {
	imports?: {
		requireStatements?: Array<string>;
		fromStatements?: Array<string>;
		dynamicImports?: Array<string>;
	};
	report?: {
		importStatements?: boolean;
		dynamicImports?: boolean;
	};
}

/**
 * AN extremely simple and reliable module extractor based on one very well
 * optmimised Regular expression
 *
 * A benchmark againts acorn shows some dramatic difference which should impact the build time by
 * the amount of gratitude
 *
 * acorn.parse: 17.796312283873558ms (100 runs)
	 fastAnalysis: 2.9928058910369875ms (100 runs)

	 This benchmark includes only parsing for acorn (without traversing the tree and extracting the statements propertly)
	 Which could potetially add a few more ms to the analysis using acorn

	 fastAnalysis is at least 9x faster. IF we imagine 100 files that need to be analysed, it will take 300ms with fastAnalysis, and with acorn that would be 5.7 seconds, and here traversing (not to mention the CPI load).And you will get some 7 seconds of just pointless manipulation.
 * @export
 * @param {IFastAnalysisProps} props
 * @returns {Partial<IFastAnalysis>}
 */
export function fastAnalysis(props: IFastAnalysisProps): IFastAnalysis {
	const result: IFastAnalysis = {
		imports: {
			requireStatements: [],
			fromStatements: [],
			dynamicImports: [],
		},
	};
	let skipNext = false;
	tokenize(props.input, token => {
		if (token.commentStart || token.singleLineComment) {
			skipNext = true;
		} else {
			if (skipNext || token.commentEnd) {
				skipNext = false;
				return;
			}
			if (token.requireStatement) {
				result.imports.requireStatements.push(token.requireStatement);
			}
			if (token.importFrom) {
				result.imports.fromStatements.push(token.importFrom);
			}
			if (token.importModule) {
				result.imports.fromStatements.push(token.importModule);
			}
			if (token.dynamicImport) {
				result.imports.dynamicImports.push(token.dynamicImport);
			}
		}
	});

	return result;
}
