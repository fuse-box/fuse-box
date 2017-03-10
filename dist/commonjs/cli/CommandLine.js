"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const fsbx = require("../index");
const cliUtils_1 = require("./cliUtils");
const docs_1 = require("./docs");
program
    .version(cliUtils_1.pkg.version);
const pluginProgram = program.command("plugins");
pluginProgram.option("-d, --docs", "documentation for the plugin");
pluginProgram.option("-c, --code", "code for the plugin");
pluginProgram.option("-a, --all", "everything about the plugin");
pluginProgram.option("-g, --github", "github link to the plugin");
pluginProgram.option("-t, --tests", "test code for the plugins");
for (const index in docs_1.plugins) {
    const pluginName = docs_1.plugins[index];
    pluginProgram.option("--" + pluginName);
}
pluginProgram
    .action(function (options) {
    const { keys } = cliUtils_1.getOpts(options);
    keys.forEach(name => {
        const Plugin = fsbx[name];
        const plugin = Plugin();
        const inspected = cliUtils_1.inspector(plugin);
        if (options.all || options.code) {
            let contents = docs_1.codeFor("plugins/" + name + ".ts");
            contents = cliUtils_1.inspector(contents.split("\n"));
            console.log(contents);
        }
        console.log(cliUtils_1.inspector(docs_1.githubSrcFor(name)));
        console.log(cliUtils_1.inspector(docs_1.docsLinkFor(name)));
        console.log(cliUtils_1.inspector(docs_1.findDocsFor(name)));
        console.log(inspected);
    });
});
program.on("--help", () => {
    cliUtils_1.execSyncStd(`node ${__dirname + "/CommandLine"} arithmetics --help`);
    cliUtils_1.execSyncStd(`node ${__dirname + "/CommandLine"} plugins --help`);
    cliUtils_1.execSyncStd(`node ${__dirname + "/CommandLine"} fuse --help`);
});
program
    .command("arithmetics")
    .option("-i, --include", "+ adds a package / file")
    .option("-e, --exclude, --ignore", "- excludes a package / file")
    .option("-c, --cache", "use caching (default)")
    .option("-C, --nocache", "^ disables the cache")
    .option("-a, --noapi", "! removes the wrapping fusebox")
    .option("-x, --execute", "> executes the index")
    .option("-b, --bundle", "[glob] bundles with no dependencies")
    .option("-g, --glob", "**/*, [**/*.js], http://www.globtester.com/")
    .option("-p, --parse", "pass in a string, parse it (use quotes, --parse='magic here')")
    .action(function (name, options) {
    console.log("eh?");
});
const { Builder } = require("./ConfigGatherer");
const config = new Builder(fsbx);
program
    .command("step")
    .action(function (name, options) {
    config.stepper();
});
program
    .command("init")
    .action(function (name, options) {
    config.init();
});
program.parse(process.argv);
