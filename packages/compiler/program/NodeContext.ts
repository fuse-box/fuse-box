export class NodeContext {
  public namespace?: string;
  constructor() {}
}

export function createNodeContext() {
  return new NodeContext();
}
