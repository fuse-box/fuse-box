import { MockedWindow } from './window';

function MockedElement(scope: MockedWindow, tagName: string) {
  const self = {
    childNodes: [],
    href: undefined,
    id: undefined,
    innerHTML: undefined,
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
      obj[prop] = value;
      return true;
    },
  });

  return proxy;
}
export function createDocument(scope: MockedWindow) {
  const head = MockedElement(scope, 'head');
  return {
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
