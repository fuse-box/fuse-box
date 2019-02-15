export interface IGenericPoolResource {
	initialize(): void;
	perform(method: string, args: Array<any>): Promise<any>;
	isBusy(): boolean;
}
export interface IPoolTask {
	method: string;
	args: Array<any>;
	completed: boolean;
	loading: boolean;
	resolve?: (data: any) => any;
	reject?: (data: any) => any;
}
export class GenericPool {
	private resources: Array<IGenericPoolResource>;
	private tasks: Array<IPoolTask>;

	constructor() {
		this.resources = [];
		this.tasks = [];
	}

	public addResource(resource: IGenericPoolResource) {
		resource.initialize();
		this.resources.push(resource);
	}

	public flush() {
		this.tasks = [];
	}

	public start() {
		const resource = this.resources.find(resource => !resource.isBusy());
		if (!resource) {
			return setTimeout(() => {
				this.start();
			}, 1);
		}

		const taskIndex = this.tasks.findIndex(task => task.loading === false && task.completed === false);
		if (taskIndex > -1) {
			const task = this.tasks[taskIndex];
			task.loading = true;
			resource
				.perform(task.method, task.args)
				.then(response => {
					task.completed = true;
					task.loading = false;
					task.resolve(response);
				})
				.catch(e => {
					task.loading = false;
					task.completed = true;
					task.reject(e);
				});
			setTimeout(() => {
				this.start();
			}, 1);
		} else {
			return setTimeout(() => {
				this.start();
			}, 1);
		}
	}

	public execute<T>(method: string, args: Array<any>): Promise<T> {
		const task: IPoolTask = {
			loading: false,
			method,
			completed: false,
			args,
		};
		this.tasks.push(task);

		const promise = new Promise<T>((resolve, reject) => {
			task.resolve = resolve;

			task.reject = reject;
		});

		return promise;
	}
}
