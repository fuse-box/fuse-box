import { FastVisit } from "../Visitor";

describe("Visitor", () => {
  describe("removal", () => {
    it("should ", () => {
      const result = FastVisit({
        ast: {
          type: "Program",
          body: {
            type: "Property",
            body: [
              { type: "PropertySignature" },
              { type: "PublicKeyword" },
              { type: "ReadonlyKeyword" },
              { type: "SequenceExpression" }
            ]
          }
        },
        fn: visit => {
          if (visit.node.type === "PublicKeyword") {
            return { removeNode: true };
          }
        }
      });
      expect(result).toEqual({
        type: "Program",
        body: {
          type: "Property",
          body: [
            {
              type: "PropertySignature"
            },
            {
              type: "ReadonlyKeyword"
            },
            {
              type: "SequenceExpression"
            }
          ]
        }
      });
    });
  });

  describe("replacer", () => {
    it("should replace arrays of 2 correctly IN Array", () => {
      const result = FastVisit({
        ast: {
          type: "Program",
          body: {
            type: "Property",
            body: [
              { type: "PropertySignature" },
              { type: "PublicKeyword" },
              { type: "ReadonlyKeyword" },
              { type: "SequenceExpression" }
            ]
          }
        },
        fn: visit => {
          if (visit.node.type === "PublicKeyword") {
            return {
              replaceWith: [
                { type: "ReturnStatement" },
                { type: "SymbolKeyword" }
              ]
            };
          }
        }
      });
      expect(result).toEqual({
        type: "Program",
        body: {
          type: "Property",
          body: [
            { type: "PropertySignature" },
            { type: "ReturnStatement" },
            { type: "SymbolKeyword" },
            { type: "ReadonlyKeyword" },
            { type: "SequenceExpression" }
          ]
        }
      });
    });

    it("should replace item correctly in one array", () => {
      const result = FastVisit({
        ast: {
          type: "Program",
          body: {
            type: "Property",
            body: [
              { type: "PropertySignature" },
              { type: "PublicKeyword" },
              { type: "ReadonlyKeyword" },
              { type: "SequenceExpression" }
            ]
          }
        },
        fn: visit => {
          if (visit.node.type === "PublicKeyword") {
            return {
              replaceWith: { type: "ReturnStatement" }
            };
          }
        }
      });

      expect(result).toEqual({
        type: "Program",
        body: {
          type: "Property",
          body: [
            { type: "PropertySignature" },
            { type: "ReturnStatement" },
            { type: "ReadonlyKeyword" },
            { type: "SequenceExpression" }
          ]
        }
      });
    });

    it("should replace item correctly in an object", () => {
      const result = FastVisit({
        ast: {
          type: "Program",
          body: {
            type: "Property",
            body: [
              { type: "PropertySignature", key: { type: "ThisType", value: 1 } }
            ]
          }
        },
        fn: visit => {
          if (visit.node.type === "ThisType") {
            return {
              replaceWith: { type: "TypeAliasDeclaration", value: 100 }
            };
          }
        }
      });
      //console.log(JSON.stringify(result, null, 2));
      expect(result).toEqual({
        type: "Program",
        body: {
          type: "Property",
          body: [
            {
              type: "PropertySignature",
              key: {
                type: "TypeAliasDeclaration",
                value: 100
              }
            }
          ]
        }
      });
    });

    it("should replace 2 times item correctly in an object", () => {
      const result = FastVisit({
        ast: {
          type: "Program",
          body: {
            type: "Property",
            body: [
              { type: "PropertySignature", key: { type: "ThisType", value: 1 } }
            ]
          }
        },
        fn: visit => {
          if (visit.node.type === "UndefinedKeyword") {
            return { replaceWith: { type: "UpdateExpression", value: 500 } };
          }
          if (visit.node.type === "ThisType") {
            return {
              replaceWith: {
                type: "TypeAliasDeclaration",
                body: [
                  { type: "TypeParameterDeclaration" },
                  { type: "UndefinedKeyword" }
                ]
              }
            };
          }
        }
      });

      expect(result).toEqual({
        type: "Program",
        body: {
          type: "Property",
          body: [
            {
              type: "PropertySignature",
              key: {
                type: "TypeAliasDeclaration",
                body: [
                  {
                    type: "TypeParameterDeclaration"
                  },
                  {
                    type: "UpdateExpression",
                    value: 500
                  }
                ]
              }
            }
          ]
        }
      });
    });
  });
});
