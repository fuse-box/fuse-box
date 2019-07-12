const { performance } = require("perf_hooks");
import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { createSourceFile, transpileModules, options } from "./transpileModule";
import { transpile } from './transpile'

const str = fs.readFileSync(path.join(__dirname, "../../core/FuseBox.ts")).toString();

const result: any = {};

function measure(name: string, fn: () => void) {
	const start = performance.now();
	fn();
	const time = performance.now() - start;
	if (!result[name]) {
		result[name] = [];
	}
	result[name].push(time);
	//console.log(`${name} in: ${time}ms`);
	return name;
}

for (let i = 0; i < 100; i++) {
	const cached = transpile('test.ts', str)

	measure("TS.transpileModule", () => {
		return ts.transpileModule(str, { compilerOptions: options });
	});
	measure("Custom TranspileModule", () => {
		const sourceFile = createSourceFile("module.ts", str);
		return transpileModules(sourceFile);
	});
	measure("Language service emit", () => {
		return transpile('test.ts', str).emit()
	});
	measure("Language service emit/update", () => {
		cached.update(str)
		return cached.emit()
	});
}

for (const item in result) {
	const totalRuns = result[item].length;
	let totalTime = 0;
	result[item].map(time => {
		totalTime += time;
	});
	const avgTime = totalTime / totalRuns;
	console.log(`${item}: ${avgTime}ms (${totalRuns} runs) `);
}
