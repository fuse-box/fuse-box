import { File } from "./core/File";
/**
 *
 *
 * @export
 * @class PrettyTrace
 */
export declare class PrettyError {
    /**
     * Prints a pretty error
     * Based on Acorn Exception
     *
     * It order for it work an exception must have err.loc with (line)
     * For example:
     *
     * Position { line: 1, column: 5 }
     *
     * @static
     * @param {*} position
     * @param {string} contents
     *
     * @memberOf PrettyTrace
     */
    static errorWithContents(error: any, file: File): void;
}
