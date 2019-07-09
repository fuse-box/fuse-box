export const htmlStrings = {
  scriptTag: (path: string) => {
    return `<script type="text/javascript" src="${path}"></script>`;
  },
  embedScriptTag: (contents: string) => {
    return `<script type="text/javascript">\n${contents}\n</script>`;
  },
  cssTag: (path: string) => {
    return `<link href="${path}" rel="stylesheet"/>`;
  },
  cssTagScript: (content: string) => {
    return `<style>\n${content}\n</style>`;
  },
};
