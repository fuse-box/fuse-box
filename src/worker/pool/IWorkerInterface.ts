export interface IWorkerTypescriptTranspileResponse {
	success: true;
	data?: any;
	error?: any;
}

export interface IWorker {
	initTypescript();
	isTypescriptReady(): boolean;
	isReady(): boolean;
	transpile(content: string, config): Promise<IWorkerTypescriptTranspileResponse>;
}
