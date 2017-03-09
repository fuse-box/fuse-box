import * as fsbx from "../index";
import * as fs from "fs";
import * as path from "path";
import {inspector} from "./cliUtils";

const base = path.resolve(__dirname, "../../");
const src = path.resolve(base, "./src");
const resolveSrc = file => path.resolve(src, file);
const resolveRoot = file => path.resolve(base, file);

const mds = {};
const mdKeys = [];
const plugins = Object.keys(fsbx).filter(key => key.includes("Plugin"));

function walk(dir, options) {
  var defaults = {
    recursive: false,
  };
  options = Object.assign(defaults, options);
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + "/" + file;
    var stat = fs.statSync(file);

    if (options.recursive) {
      if (stat && stat.isDirectory()) results = results.concat(walk(file));
      else results.push(file);
    } else if (stat && stat.isFile()) {
      results.push(file);
    }
  });
  return results;
}

function findDocsFor(name) {
  let found = ``;
  const mdsFound = [];
  const keysFound = [];
  mdKeys.forEach(key => {
    const md = mds[key];

    // @TODO: make this work better, could use md parsing
    //
    // match everything from `name`
    // until the next h1
    //
    // ((${name})(.[\\s\\S]+?(?=\#)))
    // ((HotReloadPlugin)(.[\s\S]+?(?:^#{1,2})(?!#{1,5})))

    // (#{1,4}?.[\s\S]*?[#])
    const anyU = `.[\\s\\S]*?`;
    const titleToMatch = `(#{1,2}(${anyU}))`; // ${titleToMatch}
    const untilNextTitle = `(?!#{1,5})`;
    const untilNextHeader = `(?:^#{1,2})${untilNextTitle})`;
    const reg = new RegExp(`(${titleToMatch}(${name})(${anyU}${untilNextHeader})`, "gmi");
    const match = md.match(reg);

    // md.includes(name)
    if (match) {
      mdsFound.push(md);
      const spl = match[0].split(/#{1,6}/gmi).filter(line => line && line.length > 0);
      // console.log(inspector(spl))
      // found += md.split(name).pop()
      // found += match[0];
      found += spl.pop();
      keysFound.push(key);
    }
  });

  console.log(inspector(found.split("\n")));
  return "";
}

function gatherDocs() {
  const mdFiles = walk(resolveRoot("./docs"));

  mdFiles.forEach(md => {
    const contents= fs.readFileSync(md, "utf8");
    const file = md.split("/").pop().replace(".md", "");
    mds[file] = contents;
    mdKeys.push(file);
  });
}
gatherDocs();

function githubSrcFor(name) {
  return `https://github.com/fuse-box/fuse-box/tree/master/src/plugins/` + name + ".ts";
}
function docsLinkFor(name) {
  return `http://fuse-box.org/#` + name.toLowerCase();
}
function codeFor(file): any {
  try {
    const fileAbs = resolveSrc(file);
    const contents = fs.readFileSync(fileAbs, "utf8");
    return contents;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export default {
  findDocsFor,
  githubSrcFor,
  docsLinkFor,
  codeFor,
  plugins,
};
export {
  findDocsFor,
  githubSrcFor,
  docsLinkFor,
  codeFor,
  plugins,
};
