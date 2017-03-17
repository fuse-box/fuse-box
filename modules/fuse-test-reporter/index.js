"use strict";
const realm_utils_1 = require("realm-utils");
let ansi, cursor;
if (FuseBox.isServer) {
    ansi = require("ansi");
    cursor = ansi(process.stdout);
}
const $indentString = (str, amount) => {

    let lines = str.split(/\r?\n/);
    let newLines = [];
    let emptySpace = "";
    for (let i = 0; i < amount; i++) {
        emptySpace += " ";
    }
    for (let i = 0; i < lines.length; i++) {
        newLines.push(emptySpace + lines[i]);
    }
    return newLines.join("\n");
};
const $printCategory = (title) => {
    if (cursor) {
        cursor.write(" ")
            .bold().write(`\n   ${title} ______________________ `)
            .bg.reset();
        cursor.write("\n");
        cursor.reset();
    }
};
const $printSubCategory = (title) => {
    if (cursor) {
        cursor.write("    ").bold().brightBlack().write(`${title} →`);
        cursor.write("\n");
        cursor.reset();
    }
};
const $printLine = () => {
    if (cursor) {
        cursor.write("\n");
        cursor.reset();
    }
};
const $printCaseSuccess = (name, report) => {

    if (cursor) {
        cursor.green().write(`      ✓ `)
            .brightBlack().write(name);

        if (report.data.ms > 30) {
            let msCursor = report.data.ms > 400 ? cursor.red() : cursor.yellow();
            msCursor.write(" (" + report.data.ms + " ms)");
        }
        cursor.write("\n");
        cursor.reset();
    }
};
const $printCaseError = (name, message) => {
    if (cursor) {
        cursor.red().bold().write(`      ✗ `)
            .red().write(name);
        cursor.write("\n");
        cursor.reset();
        if (message) {

            cursor.white().write($indentString(message.toString(), 10));
            cursor.write("\n");
        }
        cursor.reset();
    }
};
const $printHeading = (fileAmount) => {
    if (cursor) {
        cursor.yellow()
            .bold().write(`> Launching tests ... `);
        cursor.write("\n");
        cursor.write(`> Found ${fileAmount} files`);
        cursor.write("\n");
        cursor.reset();
    }
};
const $printStats = (data, took) => {
    if (cursor) {
        const amount = data.length;
        let totalTasks = 0;
        let failed = 0;
        let passed = 0;
        realm_utils_1.each(data, items => {
            realm_utils_1.each(items, (info, item) => {
                totalTasks += info.tasks.length;
                realm_utils_1.each(info.tasks, (task) => {

                    if (task.data.success) {
                        passed++;
                    }
                    if (task.data.error) {
                        failed++;
                    }
                });
            });
        });
        cursor.write("\n");
        cursor.write("   ☞ ");
        cursor.write("\n   ");
        cursor.green().write(` ${passed} passed `);
        cursor.reset();
        if (failed > 0) {
            cursor.write(" ");
            cursor.bold().red().write(` ${failed} failed `);
            cursor.reset();
            cursor.brightBlack().write(` (${took}ms)`);
            cursor.write("\n   ");
            cursor.reset();
            cursor.write("\n");
        } else {
            cursor.brightBlack().write(` (${took}ms)`).reset();
        }
        cursor.reset();
    }
};
class FuseBoxTestReporter {
    constructor() {}
    initialize(tests) {
        const amount = Object.keys(tests).length;
        $printHeading(amount);
    }
    startFile(name) {
        $printCategory(name);
    }
    startClass(name, item) {
        $printSubCategory(item.title);
    }
    endClass() {}
    testCase(report) {

        if (report.data && report.data.success) {

            $printCaseSuccess(report.item.title || report.item.method.report, report);
        } else {
            //console.log(report);
            let message = report.error ? report.error : report.data.error.message ? report.data.error.message : report.data.error;

            $printCaseError(report.item.title || report.item.method, report.error ? report.error.stack : message);
            if (report.data.error.stack) {
                console.log($indentString(report.data.error.stack, 10));
            }
        }
    }
    endTest(stats, took) {
        $printStats(stats, took);
        console.log("");
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FuseBoxTestReporter;