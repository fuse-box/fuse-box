#! /usr/bin/env node
const argv = require("getopts")(process.argv.slice(2));
import { Install } from "./Install";
import { Help } from "./Help";

const CMD = {
	install: Install,
	help: Help,
};
function extractParams(args) {
	if (args.help) {
		return new Help(args);
	}
	args._.forEach((name, index) => {
		if (CMD[name]) {
			args._ = args._.splice(index + 1);
			return new CMD[name](args);
		}
	});
}
function initCLI() {
	extractParams(argv);
}
initCLI();
