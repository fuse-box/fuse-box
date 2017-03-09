// @TODO:
// when this program is run,
// check for the two deps if we do not bundle them
// if they are not installed, sub process install,
// then run itself in subprocess
import * as program from "commander";
import * as fsbx from "../index";
import {
  log,
  getOpts,
  inspector,
  pkg,
  execSyncStd,
} from "./cliUtils";
import {
  githubSrcFor,
  findDocsFor,
  docsLinkFor,
  codeFor,
  plugins,
} from "./docs";

program
  .version(pkg.version);

const pluginProgram = program.command("plugins");
pluginProgram.option("-d, --docs", "documentation for the plugin");
pluginProgram.option("-c, --code", "code for the plugin");
pluginProgram.option("-a, --all", "everything about the plugin");
pluginProgram.option("-g, --github", "github link to the plugin");
pluginProgram.option("-t, --tests", "test code for the plugins");

// dynamically add all plugins as options to the plugin command options
for (const index in plugins) {
  const pluginName = plugins[index];
  // .replace('Plugin', '')
  pluginProgram.option("--" + pluginName);
}

// make your own plugins -> docs
// existing plugins -ls
// command for name
pluginProgram
  .action(function (options) {
    const { keys } = getOpts(options);
    keys.forEach(name => {
      const Plugin = fsbx[name];
      const plugin = Plugin();
      const inspected = inspector(plugin);

      if (options.all || options.code) {
        let contents = codeFor("plugins/" + name + ".ts");
        contents = inspector(contents.split("\n"));
        console.log(contents);
      }

      log.echo(githubSrcFor(name));
      log.echo(docsLinkFor(name));
      log.echo(findDocsFor(name));
      console.log(inspected);
    });
  });

// https:// github.com/tj/commander.js/#custom-help
program.on("--help", () => {
  execSyncStd(`node ${__dirname + "/CommandLine"} arithmetics --help`);
  execSyncStd(`node ${__dirname + "/CommandLine"} plugins --help`);
  execSyncStd(`node ${__dirname + "/CommandLine"} fuse --help`);

  // execSyncStd("node CommandLine step --help");
  // execSyncStd("node CommandLine init --help");
});


// @TODO:
// - [ ] interactive,
// - [ ] log results of parsing,
// - [ ] make config or allow it to be piped to config,
// - [ ] include ts interface (read file)
program
  .command("arithmetics")
  // .alias('instructions')
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

// @TODO:
// - [ ] create this array based on a saved config file
program
  .command("init")
  .action(function (name, options) {
    config.init();
  });


// http://fuse-box.org/#simplified-regexp
// http://fuse-box.org/#plugin-chaining
// program
//   .command('plugin-api')
//   .command('--test', 'simplified regex')
//   .command('--chain', 'simplified regex')

// @TODO:
// - [ ] flush this out
// program
//   .command("docs")
//   .option("-h, --homeDir", "home directory")
//   .action(function(name, options) {
//   });

// config, interactive questions
// http://fuse-box.org/#package-name
// program
//   .command('setups [eh]')
//   .options('-s,--sourceMaps', 'sourceMaps')
//   .options('-c,--cache', 'cache')
//   .options('-d,--debug', 'debug')
//   .options('-a,--alias', 'alias')
//   .options('-l,--log', 'log')
//   .options('-m,--shim', 'shimming')
//   .options('-i,--autoimport', 'autoimport')
//   .options('-e,--exports', 'exports')
//   .options('-g,--globals', 'globals & exports (package)')
//   .options('-k,--package,--pkg', 'package name(s)')
//   .action(function(name, options) {
//     log.echo('eh')
//   })

// @TODO:
// - [ ] build / transpile to memory,
// - [ ] decorate,
// - [ ] pass in opts from cli,
// - [ ] extract helpful part from flipbox
// program
//   .command("fuse [config]")
//   .option("-r, --run", "run dev server")
//   .option("-b, --bundle", "bundle it")
//   .option("-p, --production", "production mode")
//   .option("-d, --debug", "debug / dev mode")
//   .option("-p, --plugins", "pick plugins to use")
//   .option("-i, --instructions", "instructions to use")
//   // .option("-f, --config", "config location")
//   .action(function(name, options) {
//     let use = "";
//     if (options.cache) use += " cache=true";
//     if (options.run) use += " run=true";
//     if (options.config) use += " config=" + options.config;
//
//     var p = typeof prod != "undefined" ? " -p " : "";
//     var d = typeof debug != "undefined" ? `NODE_ENV=DEVELOPMENT ` : "";
//     var env = `apps=${name} ${d} ${p} ${use}`;
//   });

program.parse(process.argv);
