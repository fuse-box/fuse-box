import { File } from "./File";

const acorn = require("acorn");
const ASTQ = require("astq");
let astq = new ASTQ();

require("acorn-es7")(acorn);

/**
 * Makes static analysis on the code
 * Gets require statements (es5 and es6) 
 * 
 * Adds additional injections (if needed)
 * 
 * @export
 * @class FileAST
 */
export class FileAST {

    /**
     * Acorn AST
     * 
     * @type {*}
     * @memberOf FileAST
     */
    public ast: any;

    /**
     * A list of dependencies 
     * 
     * @type {string[]}
     * @memberOf FileAST
     */
    public dependencies: string[] = [];

    /**
     * Creates an instance of FileAST.
     * 
     * @param {File} file
     * 
     * @memberOf FileAST
     */
    constructor(public file: File) { }


    /**
     * Consuming contents with analysis
     * 
     * 
     * @memberOf FileAST
     */
    public consume() {
        this.parse();
        this.processNodejsVariables();
        //this.extractStreamVariables();
        this.processDependencies();
    }

    /**
     * 
     * 
     * @private
     * 
     * @memberOf FileAST
     */
    private parse() {
        this.ast = acorn.parse(this.file.contents, {
            sourceType: "module",
            tolerant: true,
            ecmaVersion: 8,
            plugins: { es7: true },

        });
    }

    /**
     * Extract dependencies
     * 
     * @private
     * 
     * @memberOf FileAST
     */
    private processDependencies() {
        let matches = astq.query(this.ast,
            `// CallExpression[/Identifier[@name=="require"]], / ImportDeclaration[/Literal]`);

        matches.map(item => {
            // es5 require
            if (item.arguments) {
                if (item.arguments[0]) {
                    let name = item.arguments[0].value;
                    if (!name) { return; }
                    this.dependencies.push(name);
                }
            }
            // es6 import
            if (item.source) { this.dependencies.push(item.source.value); }
        });
    }

    private extractStreamVariables() {
        // Making sure we are not adding it where a definition of "process"" has been seen;
        // For example var process = {} will not add "process"" as a dependency
        // Otherwise we will go into an infinite loop
        let streamisDefined = astq.query(this.ast, `// VariableDeclarator/Identifier[@name=="stream"]`);
        if (streamisDefined.length) {
            return;
        }
        // Lookup for "process"" mention
        let result = astq.query(this.ast, `// MemberExpression/Identifier[@name=="stream"]`);
        if (!result.length) {
            return;
        }

        this.dependencies.push("stream");
        // This will be added later at wrap time
        this.file.addHeaderContent(`var stream = require("stream");`);
    }
    /**
     * Process additional conditions
     * For example "process" variables
     * 
     * @private
     * 
     * @memberOf FileAST
     */
    private processNodejsVariables() {
        // Making sure we are not adding it where a definition of "process"" has been seen;
        // For example var process = {} will not add "process"" as a dependency
        // Otherwise we will go into an infinite loop
        let processIsDefined = astq.query(this.ast, `// VariableDeclarator/Identifier[@name=="process"]`);
        if (processIsDefined.length) {
            return;
        }
        // Lookup for "process"" mention
        let result = astq.query(this.ast, `// MemberExpression/Identifier[@name=="process"]`);
        if (!result.length) {
            return;
        }

        this.dependencies.push("process");
        // This will be added later at wrap time
        this.file.addHeaderContent(`var process = require("process");`);
    }
}
