import { createConfig } from "./config";
import { IConfig } from "./interfaces";
import { IAssembleContext, assembleContext } from "./assemble_context";
export class Context {
	public assembleContext: IAssembleContext;
	constructor(public config: IConfig) {
		this.assembleContext = assembleContext(this);
	}
}

export function createContext(cfg?: IConfig) {
	return new Context(createConfig(cfg));
}
