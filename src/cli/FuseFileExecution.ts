export class FuseFileExecution {
	constructor(public args: any) {}

	public static test() {
		console.log(process.cwd());
	}

	public install() {
		console.log(this.args);
		console.log("install");
	}
	public static init(args: any) {
		console.log("init", args);
		return new FuseFileExecution(args);
	}
}
