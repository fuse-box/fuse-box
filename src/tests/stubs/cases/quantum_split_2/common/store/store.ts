import { jwtdecode } from "../auth";

console.log("here shit");
export const Store = () => {
	console.log("********************************");
	console.log("decode?", jwtdecode);
};
