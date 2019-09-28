import { ITransformer } from "../program/transpileModule";
import { IVisit } from "../Visitor/Visitor";

export function ConstructorTransformer(): ITransformer {
  return (visit: IVisit) => {
    const { node, scope } = visit;

    if (node.type === "ClassDeclaration") {
      let classNames: Array<string>;
      if (scope && scope.meta && scope.meta.classNames) {
        classNames = scope.meta.classNames;
      } else {
        classNames = [];
      }
      classNames.push(node.id.name);

      return { scopeMeta: { classNames } };
    }

    if (node.type === "ParameterProperty") {
      // const assignable = [];
      // if (!visit.parent.body["scope"]) {
      //   visit.parent.body["scope"] = { assignable: assignable };
      // }
      // assignable.push(node.parameter.name);

      return { replaceWith: { type: "Identifier", name: node.parameter.name } };
    }

    if (node.type === "Identifier") {
      const meta = visit.scope.meta;

      if (node.name === "FirstClass_hey") {
        const className = meta.classNames[meta.classNames.length - 1];
        console.log("FirstClass_hey parent class", className);
      }

      if (node.name === "SubClass_hey") {
        const className = meta.classNames[meta.classNames.length - 1];
        console.log("SubClass_hey  parent class", className);
      }
    }

    // if (node.type === "ClassBody") {
    //   const body = node.body as Array<ASTNode>;
    //   const constructor = body.find(i => i.kind === "constructor");
    //   if (constructor) {
    //     if (constructor.value && constructor.value.params) {
    //       constructor.value.params = constructor.value.params.map(item => ({
    //         type: "Identifier",
    //         name: item.parameter.name
    //       }));
    //     }
    //   }
    // }
  };
}
