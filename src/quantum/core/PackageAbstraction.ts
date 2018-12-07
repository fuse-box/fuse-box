import { BundleAbstraction } from "./BundleAbstraction";
import { FileAbstraction } from "./FileAbstraction";
import { ASTTraverse } from "../../ASTTraverse";
import { QuantumBit } from "../plugin/QuantumBit";

export class PackageAbstraction {
	public fileAbstractions: Map<string, FileAbstraction>;
	public entryFile: string = "index.js";
	public entries: Map<string, FileAbstraction>;

	public quantumBit: QuantumBit;
	public conflictingLibraries: { [key: string]: string };
	public quantumBitBanned = false;
	public quantumDynamic = false;
	constructor(public name: string, public bundleAbstraction: BundleAbstraction) {
		this.entries = new Map<string, FileAbstraction>();
		this.fileAbstractions = new Map<string, FileAbstraction>();
		bundleAbstraction.registerPackageAbstraction(this);
	}

	public assignBundle(bundleAbstraction: BundleAbstraction) {
		this.bundleAbstraction.packageAbstractions.delete(this.name);
		this.bundleAbstraction = bundleAbstraction;
		bundleAbstraction.packageAbstractions.set(this.name, this);
	}
	public registerFileAbstraction(fileAbstraction: FileAbstraction) {
		this.fileAbstractions.set(fileAbstraction.fuseBoxPath, fileAbstraction);
	}

	public loadAst(ast: any) {
		//console.log(JSON.stringify(ast, null, 2));
		ASTTraverse.traverse(ast, {
			pre: (node, parent, prop, idx) => {
				// getting an entry file
				if (
					node.type === "ReturnStatement" &&
					node.argument.left.type === "MemberExpression" &&
					node.argument.left.object.name === "___scope___" &&
					node.argument.left.property.name === "entry" &&
					node.argument.right &&
					node.argument.right.type === "Literal"
				) {
					this.entryFile = node.argument.right.value;
				}

				// collecting files
				if (node.type === "CallExpression" && node.callee && node.callee.type === "MemberExpression") {
					const callee = node.callee;
					if (callee.object && callee.object.name === "___scope___" && callee.property.name === "file") {
						const fileName = node.arguments[0].value;
						const fn = node.arguments[1];
						if (fn && fn.type === "FunctionExpression") {
							const fileAbstraction = new FileAbstraction(fileName, this);
							fileAbstraction.loadAst(fn.body);
							return false;
						}
					}
				}
			},
		});
	}
}
