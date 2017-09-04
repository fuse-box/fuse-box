import { ProducerAbstraction } from "./ProducerAbstraction";
import { PackageAbstraction } from "./PackageAbstraction";
import { ASTTraverse } from "../../ASTTraverse";
import { acornParse } from "../../analysis/FileAnalysis";
import { FileAbstraction } from "./FileAbstraction";
import { RequireStatement } from "./nodes/RequireStatement";

export class BundleAbstraction {
    public splitAbstraction = false;
    public packageAbstractions = new Map<string, PackageAbstraction​​>();
    public producerAbstraction: ProducerAbstraction;
    public globalVariableRequired = false;
    /**
     * 
     * { "React" : [ 1,2,3,4 ] } 
     * 
     * @memberof BundleAbstraction
     */
    public identifiers = new Map<string,
        Set<{ statement: RequireStatement, file: FileAbstraction }>>();

    public hoisted = new Map<string, FileAbstraction>();

    constructor(public name: string) {
        //producerAbstraction.registerBundleAbstraction(this);
    }

    public registerHoistedIdentifiers(identifier: string, statement: RequireStatement, file: FileAbstraction) {
        let list: Set<{ statement: RequireStatement, file: FileAbstraction }>
        if (!this.identifiers.has(identifier)) {
            list = new Set<{ statement: RequireStatement, file: FileAbstraction }>();
            this.identifiers.set(identifier, list);
        } else {
            list = this.identifiers.get(identifier);
        }
        list.add({ statement: statement, file: file });
    }

    public registerPackageAbstraction(packageAbstraction: PackageAbstraction​​) {
        this.packageAbstractions.set(packageAbstraction.name, packageAbstraction);
    }

    public parse(contents: string) {

        const ast = acornParse​​(contents);
        ASTTraverse.traverse(ast, {
            pre: (node, parent, prop, idx) => {
                if (node.type === "MemberExpression") {
                    if (node.object && node.object.type === "Identifier"
                        && node.object.name === "FuseBox"
                        && node.property && node.property.type === "Identifier"
                        && node.property.name === "pkg"
                        && parent.arguments && parent.arguments.length === 3
                    ) {
                        let pkgName = parent.arguments[0].value;
                        if (pkgName.charAt(0) !== "@") {
                            pkgName = pkgName.split('@')[0];
                        }
                        const packageAst = parent.arguments[2].body;
                        let packageAbstraction;
                        if (this.packageAbstractions.get(pkgName)) {
                            packageAbstraction = this.packageAbstractions.get(pkgName);
                        } else {
                            packageAbstraction = new PackageAbstraction​​(pkgName, this)
                        }
                        packageAbstraction.loadAst(packageAst);
                        return false;
                    }
                }
            }
        })

    }
}
