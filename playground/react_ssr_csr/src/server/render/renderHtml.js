import * as fs from 'fs';
import { resolve } from 'path';

export const renderHtml = () => (_, res, next) => {
  const webIndexFile = resolve(process.cwd(), './dist/client/index.html');
  const webIndex = fs
    .readFileSync(webIndexFile)
    .toString();
  res.response = webIndex.replace(/\{\{\s*ssr\s*\}\}/, res.component);
  next();
};

export default null;
