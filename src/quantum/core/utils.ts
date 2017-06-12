import * as path from "path";
import { joinFuseBoxPath } from "../../Utils";

export function generateFileCombinations(input: string): string[] {
    if (!input) {
        return undefined;
    }
    let ext = path.extname(input);
    let combinations = [input];
    if (input.endsWith("/")) {
        combinations.push(
            joinFuseBoxPath(input, "index.js"),
            joinFuseBoxPath(input, "index.jsx")
        )
    } else {
        if (!ext) {
            combinations.push(
                `${input}.js`,
                `${input}.jsx`,
                joinFuseBoxPath(input, "index.js"),
                joinFuseBoxPath(input, "index.jsx"),
            )
        }
    }
    // some cases have weired conventions
    combinations.push(combinations + ".js");
    return combinations;
}
