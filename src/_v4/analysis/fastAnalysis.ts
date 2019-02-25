interface IFastAnalysisProps {
	input: string;
}
interface IFastAnalysis {
	requireStatements?: Array<string>;
	fromStatements?: Array<string>;
	dynamicImports?: Array<string>;
}
export function fastAnalysis(props: IFastAnalysisProps): IFastAnalysis {
	return {};
}
