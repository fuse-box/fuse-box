import { CSSFile } from "./CSSFile";
import { QuantumCore } from "../plugin/QuantumCore";
import { Concat, joinFuseBoxPath } from "../../Utils";
import { QuantumBit } from "../plugin/QuantumBit";

export class CSSCollection {
	public collection = new Set<CSSFile>();
	public sourceMap: any;
	public useSourceMaps = false;
	public quantumBit: QuantumBit;
	private renderedString: string;
	private renderedFileName: string;
	public sourceMapsPath: string;
	public splitCSS: boolean;
	public written: boolean;
	constructor(public core: QuantumCore) {}

	public add(css: CSSFile) {
		this.collection.add(css);
	}

	public render(fileName: string) {
		this.renderedFileName = fileName;
		const producer = this.core.producer;
		const concat = new Concat(true, fileName, "\n");
		this.collection.forEach(file => {
			this.core.log.echoInfo(`CSS: Grouping inlined css ${file.name} into ${this.renderedFileName}`);
			const sourceMaps = producer.sharedSourceMaps.get(file.name);
			const contents = file.contents.replace(/\/*#\s*sourceMappingURL=\s*([^\s]+)\s*\*\//, "");
			concat.add(null, `/* ${file.name} */`);
			if (sourceMaps) {
				this.useSourceMaps = true;
				concat.add(file.name, contents, sourceMaps);
			} else {
				concat.add(null, contents);
			}
		});
		if (this.useSourceMaps) {
			this.sourceMapsPath = joinFuseBoxPath("/", `${this.renderedFileName}.map`);
			concat.add(null, `/*# sourceMappingURL=${this.sourceMapsPath} */`);
		}
		this.sourceMap = concat.sourceMap;
		this.renderedString = concat.content.toString();
		return this.renderedString;
	}

	public getString() {
		return this.renderedString;
	}

	public setString(str: string) {
		if (this.useSourceMaps) {
			str += "\n/*# sourceMappingURL=" + this.sourceMapsPath + " */";
		}
		this.renderedString = str;
		return str;
	}
}
