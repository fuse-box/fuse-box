export const htmlStrings = {
  scriptTag: (path: string) => {
    return `<script type="text/javascript" src="${path}"></script>`;
  },
  cssTag: (path: string) => {
    return `<link href="${path}" rel="stylesheet"/>`;
  },
};
