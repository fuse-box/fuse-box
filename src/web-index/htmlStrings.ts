export const htmlStrings = {
  cssTag: (path: string) => {
    return `<link href="${path}" rel="stylesheet"/>`;
  },
  cssTagScript: (content: string) => {
    return `<style>\n${content}\n</style>`;
  },
  embedScriptTag: (contents: string) => {
    return `<script type="text/javascript">\n${contents}\n</script>`;
  },
  scriptTag: (path: string) => {
    return `<script type="text/javascript" src="${path}"></script>`;
  },
};
