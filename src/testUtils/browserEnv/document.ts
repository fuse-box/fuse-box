import * as path from 'path';
import { readFile } from '../../utils/utils';
import { MockedWindow } from './window';
function MockedElement(scope: MockedWindow, tagName: string) {
  const self = {
    childNodes: [],
    href: undefined,
    id: undefined,
    innerHTML: undefined,
    onload: undefined,
    rel: undefined,
    tagName,
    type: undefined,
    appendChild: el => {
      self.childNodes.push(el);
    },
  };

  const proxy = new Proxy(self, {
    get(obj, key) {
      return obj[key];
    },
    has() {
      return true;
    },
    set: function(obj, prop, value) {
      if (self.tagName === 'link' && self.rel === 'stylesheet' && prop === 'href') {
        scope.$loadedCSSFiles.push(value);
        if (self.onload) self.onload();
      }

      if (self.tagName === 'script' && prop === 'src') {
        const file = path.join(scope.workspace.distRoot, value);
        const contents = readFile(file);

        scope.$eval(contents);
        if (self.onload) {
          self.onload();
        }
      }
      obj[prop] = value;
      return true;
    },
  });

  return proxy;
}
export function createDocument(scope: MockedWindow) {
  const head = MockedElement(scope, 'head');
  return {
    head,
    createElement: tag => {
      const newEl = MockedElement(scope, tag);
      scope.$createdDOMElements.push(newEl);
      return newEl;
    },
    getElementById: id => {
      return scope.$createdDOMElements.find(item => item.id === id);
    },
    getElementsByTagName: tagName => {
      if (tagName === 'head') return [head];
    },
  };
}
