import { File } from "./core/File";

const ansi = require("ansi");
const cursor = ansi(process.stdout);

/**
 *
 *
 * @export
 * @class PrettyTrace
 */
export class PrettyError {
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
    public static errorWithContents(error: any, file: File) {
        let contents = file.contents;
        let lines = contents.split(/\r?\n/);
        let position = error.loc;

        // If an exception does not have what we need to just pass it over
        if (!position || !position.line) {
            throw error;
        }
        let l = cursor;
        // Printing a pretty error
        l.white().bg.red().bold().write(`Acorn error: ${error.message}`);
        l.reset().write("\n");
        l.bold().write(`File: ${file.absPath}`);
        l.write("\n\n").reset();

        let errorLine = position.line * 1;
        lines.forEach((line, index) => {
            let fits = Math.abs(index - errorLine) <= 3;
            if (fits) {
                if (index + 1 === errorLine) {
                    l.white().bg.red().write(`${index + 1}  ${line}`);
                    l.bg.reset();
                } else {
                    l.reset().write(`${index + 1} `).red().write(` ${line}`);
                }
                l.write("\n").reset();
            }
        });
        l.write("\n");
        throw "";
    }
}
