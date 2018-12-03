import { should } from "fuse-test-runner";
import { bumpVersion } from "./SparkyUtils";

export class SparkyUtilsTest {
	"Should bump patch"() {
		const json = bumpVersion("package.json", {
			userJson: { version: "2.1.1" },
			type: "patch",
		});
		should(json.version).equal("2.1.2");
	}

	"Should bump minor"() {
		const json = bumpVersion("package.json", {
			userJson: { version: "2.1.1" },
			type: "minor",
		});
		should(json.version).equal("2.2.0");
	}

	"Should bump major"() {
		const json = bumpVersion("package.json", {
			userJson: { version: "2.1.1" },
			type: "major",
		});
		should(json.version).equal("3.0.0");
	}

	"Should bump next"() {
		const json = bumpVersion("package.json", {
			userJson: { version: "2.1.1" },
			type: "next",
		});
		should(json.version).equal("2.1.1-next.1");
	}

	"Should bump existing next"() {
		const json = bumpVersion("package.json", {
			userJson: { version: "2.1.1-next.1" },
			type: "next",
		});
		should(json.version).equal("2.1.1-next.2");
	}

	"Should ignore next when going for patch"() {
		const json = bumpVersion("package.json", {
			userJson: { version: "2.1.1-next.1" },
			type: "patch",
		});
		should(json.version).equal("2.1.2");
	}
	"Should ignore next when going for minor"() {
		const json = bumpVersion("package.json", {
			userJson: { version: "2.1.1-next.1" },
			type: "minor",
		});
		should(json.version).equal("2.2.0");
	}

	"Should ignore next when going for major"() {
		const json = bumpVersion("package.json", {
			userJson: { version: "2.1.1-next.1" },
			type: "major",
		});
		should(json.version).equal("3.0.0");
	}
}
