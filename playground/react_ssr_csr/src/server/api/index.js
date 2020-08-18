import * as express from 'express';

import { sendResponse } from '../middleware/sendResponse';

const api = express.Router();

api.get(
  '/info',
  (_, res) => {
    res.response = { version: '0.0.0' };
  },
  sendResponse()
);

export { api };

export default null;
