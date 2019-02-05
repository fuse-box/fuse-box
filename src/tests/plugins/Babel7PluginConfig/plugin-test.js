// Helper, check if local plugin is loaded
module.exports = function testPlugin(api) {
  api.assertVersion(7);
  return {
    name: "plugin-test",
    visitor: {
      FunctionDeclaration({ node }) {
        // Helper, checks whether plugin was called or not successfully
        node.id.name = "IwasTranspiledWithBabel";
      },
      StringLiteral({ node }, state) {
        // Helper, checks if filename is provided in parser options in Babel7 plugin | Issue #1463
        if (node.value === "replaceWithFilename") {
          const { filename } = state.file.opts;
          node.value = String(filename || "");
        }
      },
    },
  };
};
