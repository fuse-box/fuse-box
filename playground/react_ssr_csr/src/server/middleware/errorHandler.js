import * as chalk from 'chalk';
import { createDraft, finishDraft } from 'immer';

import { AuthenticationError } from '../errors/AuthenticationError';
import { BadRequestError } from '../errors/BadRequestError';
import { ForbiddenError } from '../errors/ForbiddenError';
import { NotFoundError } from '../errors/NotFoundError';

export const errorHandler = () => (err, req, res) => {
  const { message, ...rest } = err;
  const draft = createDraft({
    title: message
  });
  if (__DEVELOPMENT__) {
    draft.details = rest;
  }

  switch (err.constructor) {
    case AuthenticationError:
      draft.status = 401;
      draft.type = 'Unauthorized';
      break;
    case BadRequestError:
      draft.status = 400;
      draft.type = 'Bad request';
      break;
    case ForbiddenError:
      draft.status = 403;
      draft.type = 'Forbidden';
      break;
    case NotFoundError:
      draft.status = 404;
      draft.type = 'Not found';
      break;
    default:
      draft.status = 500;
      draft.type = 'Internal server error';
      break;
  }
  process.stdout.write(
    chalk`{bold.red [HTTP2]} [${req.method}] ${req.url} (${draft.status})\n`
  );
  const response = finishDraft(draft);
  res.status(response.status).json(response);
};

export default null;
