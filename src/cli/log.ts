import * as chalk from "chalk";

export function info(text: string) {
	console.log(chalk.gray(`  : ${text}`));
}
export function help(obj: any) {
	for (const cmd in obj) {
		console.log("   " + chalk.green.bold(cmd));
		console.log(chalk.gray(`    ${obj[cmd]}`));
	}
}
export function error(text: string) {
	console.log(chalk.bold.red(`  : ${text}`));
}
export function title(text: string) {
	console.log(chalk.bold.green(`    ${text}`));
}
export function desc(text: string) {
	console.log(chalk.gray(`     - ${text}`));
}
