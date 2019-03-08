import { ICacheAdapter } from "./Interfaces";

export class MemoryAdapter implements ICacheAdapter {
	constructor() {
		this.data = {};
	}
	public data: { [key: string]: any };

	/**
	 * Stores key and value
	 *
	 * @param {string} key
	 * @param {*} value
	 * @memberof MemoryAdapter
	 */
	set(key: string, value: any) {
		this.data[key] = value;
	}

	/**
	 * Gets value by key
	 *
	 * @param {string} key
	 * @returns
	 * @memberof MemoryAdapter
	 */
	get(key: string) {
		return this.data[key];
	}

	ensure(key: string) {
		const json = this.get(key) || {};
		this.set(key, json);
		return json;
	}
	sync() {}
}

export function getMemoryAdapter(): ICacheAdapter {
	return new MemoryAdapter();
}
