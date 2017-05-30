import { GenericAst } from "./GenericAst";

export class NamedExport {
    public name: string;
    public isUsed = false;
    public eligibleForTreeShaking = true;

    private nodes = new Set<GenericAst>();

    public addNode(ast: any, prop: string, node: any) {
        this.nodes.add(new GenericAst(ast, prop, node));
    }

    public remove() {
        this.nodes.forEach(item => item.remove())
    }
}

// export class NamedExport extends GenericAst {
//     public name: string;
//     public isUsed = false;


// }