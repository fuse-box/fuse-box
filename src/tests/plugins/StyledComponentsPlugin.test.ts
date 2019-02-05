import { should } from "fuse-test-runner";
import { createEnv } from "../stubs/TestEnvironment";
import { StyledComponentsPlugin } from "../../plugins/StyledComponentsPlugin";

export class StyledComponentsPluginTest {
	"Should return styled component"() {
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
			should(contents).findString('React.createElement(MyHeader, null, "Test")');
		});
	}

	"Should return styled component with option getDisplayName"() {
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
			should(contents).findString("Testing_MyTestTitle_value");
		});
	}
}
