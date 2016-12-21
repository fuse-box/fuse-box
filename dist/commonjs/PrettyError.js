"use strict";
const ansi = require("ansi");
const cursor = ansi(process.stdout);
class PrettyError {
    static errorWithContents(error, file) {
        let contents = file.contents;
        let lines = contents.split(/\r?\n/);
        let position = error.loc;
        if (!position || !position.line) {
            throw error;
        }
        let l = cursor;
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
                }
                else {
                    l.brightBlack().write(`${index + 1} `).red().write(` ${line}`);
                }
                l.write("\n").reset();
            }
        });
        l.write("\n");
        throw "";
    }
}
exports.PrettyError = PrettyError;
