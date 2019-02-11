const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, process.argv[2]);

let content = fs.readFileSync(filePath).toString();

const header = content.match(/export class (.*?)\s*\{/);
if (header) {
  content = content.replace(header[0], `describe("${header[1]}", () => {`);
}
//

const replaceWords = line => {
  const words = [
    [/should\(/, "expect("],
    [/\.findString\(/, ".toContain("],
    [/\.notFindString\(/, ".not.toContain("],
    [/\.deepEqual\(/, ".toEqual("],
    [/\.beObject\(/, ".toBeTruthy("],
  ];
  words.map(item => {
    line = line.replace(item[0], item[1]);
  });
  return line;
};
const lines = content.split("\n");
const newLines = [];
lines.map(line => {
  const _im1 = line.match(/^import \{\s*createEnv\s*\}.*/);
  if (_im1) {
    line = line.replace(
      _im1[0],
      `import { createEnv } from "./_helpers/OldEnv";`,
    );
  }

  if (line.match(/^import \{\s*should\s*\}.*/)) {
    line = "";
  }

  line = replaceWords(line);

  const method = line.match(/\s+"(.*)"\(\)\s*\{/);
  if (method) {
    let search = true;
    let attempts = 0;
    let prevLine = newLines.length - 1;
    while (search && attempts < 5) {
      let prev = newLines[prevLine];

      if (prev && prev.match(/^\s*\}\s*$/)) {
        newLines[prevLine] = prev.replace(/\}/, "})");
        search = false;
      }
      attempts++;
      prevLine = prevLine - 1;
    }
    line = line.replace(method[0], '\tit("' + method[1] + '", () => {');
  }
  newLines.push(line);
});
content = newLines.join("\n");

//fs.writeFileSync(filePath.replace(".ts", "new.ts"), content);

fs.writeFileSync(filePath, content);
// const newLines = [];
// lines.map(line => {
//   if
// });
// const newContent = newLines.join("\n");
// fs.writeFileSync(file, newContent);

// const files = walkSync(__dirname + '/src');
// files.map(file => {
//   if (/\.ts$/.test(file)) {
//     fixFile(file);
//   }
// });
