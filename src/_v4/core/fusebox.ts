import { createContext } from "./context";
import { IConfig } from "./interfaces";

export interface IBundleProps {
	entry: string;
	exclude: Array<string>;
	include: Array<string>;
	withDependencies?: boolean;
	extractDependenciesTo: string;
}

export interface IDevelopmentProps {
	httpServer?: {
		port?: number;
		fallback?: string;
	};
	hmr?:
		| undefined
		| {
				port?: number;
		  }
		| boolean;
}
export interface IProductionProps {}

export function fusebox(config: IConfig) {
	const ctx = createContext(config);
	return {
		bundle: (name: string, props: IBundleProps) => {},
		runDevelopment: (props: IDevelopmentProps) => {},
		runProduction: (props: IProductionProps) => {},
	};
}
