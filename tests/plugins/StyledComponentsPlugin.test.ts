import { FuseTestEnv } from "../_helpers/stubs/FuseTestEnv";
import { createEnv } from "../_helpers/OldEnv";
import { StyledComponentsPlugin } from "../../src";

describe("StyledComponentsPluginTest", () => {
	it("Should return styled component", () => {
		return createEnv({
			project: {
				files: {
					"index.tsx": `
								import * as React from 'react';
								import * as ReactDOM from 'react-dom';
								import styled from 'styled-components'
                const MyTestTitle = styled.h1\`
                  color: red;
                \`;
                ReactDOM.render(
									<MyHeader>Test</MyHeader>, document.getElementById('root'));`,
				},
				plugins: [StyledComponentsPlugin()],
				instructions: ">index.tsx",
			},
		}).then(result => {
			result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();
			expect(contents).toContain('React.createElement(MyHeader, null, "Test")');
		});
	});

	it("Should return styled component with option getDisplayName", () => {
		return createEnv({
			project: {
				files: {
					"index.tsx": `
								import * as React from 'react';
								import * as ReactDOM from 'react-dom';
								import styled from 'styled-components'
                const MyTestTitle = styled.h1\`
                  color: red;
                \`;
                ReactDOM.render(
									<MyHeader>Test</MyHeader>, document.getElementById('root'));`,
				},
				plugins: [
					StyledComponentsPlugin({
						getDisplayName: function(filename, bindingName) {
							return "Testing_" + bindingName + "_value";
						},
					}),
				],
				instructions: ">index.tsx",
			},
		}).then(result => {
			result.project.FuseBox.import("./index");
			const contents = result.projectContents.toString();
			expect(contents).toContain("Testing_MyTestTitle_value");
		});
	});
});
