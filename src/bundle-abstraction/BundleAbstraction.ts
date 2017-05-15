import { ProducerAbstraction } from "./ProducerAbstraction";
import { PackageAbstraction } from "./PackageAbstraction";
import { acornParse } from "../analysis/FileAnalysis";
import { ASTTraverse } from "../ASTTraverse";

export class BundleAbstraction {
    public packageAbstractions = new Map<string, PackageAbstraction​​>();
    constructor(public name: string, public producerAbstraction: ProducerAbstraction) {
        producerAbstraction.registerBundleAbstraction(this);
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
                        const pkgName = parent.arguments[0].value;
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

