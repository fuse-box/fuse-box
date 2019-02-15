import * as ts from "typescript";
import { WorkerConnection } from "./WorkerConnection";
import { GenericPool } from "./GenericPool";

const maxWorkers = 5;

const ports = [1800, 1801, 1802, 1803];
export class WorkerPool {
	private connections: Array<{ port: number; connection: WorkerConnection }>;
	private tasks = [];

	private pool: GenericPool;
	constructor() {
		this.pool = new GenericPool();
		this.connections = [];
	}

	public queue(fn: () => void) {
		this.tasks.push(fn);
	}

	public resolve() {
		return Promise.all(this.tasks.map(fn => fn())).then(() => this.pool.flush());
	}

	public async init() {
		for (const port of ports) {
			if (!this.connections.find(item => item.port === port)) {
				const newConnection = new WorkerConnection(port);
				this.pool.addResource(newConnection);
			}
		}
		this.pool.start();
	}

	public async transpile(contents: string, config: any): Promise<ts.TranspileOutput> {
		return this.pool.execute<ts.TranspileOutput>("transpile", [contents, config]);
	}
}
export const workerPool = new WorkerPool();
