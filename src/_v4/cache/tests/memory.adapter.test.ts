import { getMemoryAdapter } from "../adapters";
import { ICacheAdapter } from "../Interfaces";

describe("Memory adapter", () => {
	let adapter: ICacheAdapter;
	beforeEach(() => {
		adapter = getMemoryAdapter();
	});
	it("Should store and retrieve value", () => {
		adapter.set("foo", "bar");
		expect(adapter.get("foo")).toEqual("bar");
	});

	it("Should not be in  global cache", () => {
		expect(adapter.get("foo")).toEqual(undefined);
	});
});
