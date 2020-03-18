import * as React from 'react';
// this import should work because
// @myorg/foo/package.json has a "main" which has "dist/index.js"
// and ../tsconfig.json references @myorg/foo/tsconfig.json which declares a src and dist
// and so @myorg/foo gets translated to @myorg/foo/dist/index.js and then further translated to @myorg/foo/src/index.ts
// and this works even if @myorg/foo/dist/index.js doesn't exist
import * as Foo from '@myorg/foo';
// this direct import also works
// and if you use vscode, hovering over this will show that vscode also knows that the type of this is the string "Strawberry"
// even though @myorg/foo/dist/red.js doesn't exist
import { strawberry } from '@myorg/foo/dist/red';

console.log(Foo);

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>This is the Typescript Monorepo Playground</p>
        <pre style={{ backgroundColor: '#e9e9e9', padding: 8, margin: 20, color: 'blue', border: 'solid 2px blue' }}>{`
${Foo.foo()}
                      ^^^^             ^
                        |              '-- This number comes from a transitive
                        |                  dependency, first on red.ts in foo
                        |                  and then to blue.ts in bar
                        |                  and finally @myorg/bar/src/watchtrigger.ts
                        |                  which you can edit to see this change
                        |
                        '--- Whether this shows Bar1 or Bar2 is based on the "main"
                             field of @myorg/bar/package.json
${strawberry}
                  ^^^^
                    '--- This is based on the same "main" field of the same package.json
                         But via a more direct path.  These should change simultaneously

There is some code in fuse-app/fuse/fuse.ts that can be uncommented to write changes
to these files automatically
        `}</pre>
      </header>
    </div>
  );
};

export default App;
