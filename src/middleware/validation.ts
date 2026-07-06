import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validate = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(v => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(e => ({ field: (e as any).path || (e as any).param, message: e.msg, value: (e as any).value })),
    });
  };
};

export const chatValidation = [
  body('sessionId').isLength({ min: 10, max: 100 }).trim().escape(),
  body('content').isLength({ min: 1, max: 10000 }).trim(),
  body('pageSource').optional().isIn(['home', 'workspace', 'admin', 'safedrop']),
];

export const planValidation = [
  body('idea').isLength({ min: 1, max: 5000 }).trim(),
];

export const vaultValidation = [
  body('keyName').isLength({ min: 1, max: 100 }).trim().escape(),
  body('value').isLength({ min: 1, max: 5000 }),
  body('itemType').isIn(['api_key', 'password', 'token', 'secret', 'note']),
  body('masterPassword').isLength({ min: 8, max: 128 }),
];

export const wikiValidation = [
  body('title').isLength({ min: 1, max: 200 }).trim().escape(),
  body('content').isLength({ min: 1, max: 50000 }),
];

export const githubPushValidation = [
  body('repoName').isLength({ min: 1, max: 100 }).trim().matches(/^[a-zA-Z0-9_.-]+$/),
  body('commitMessage').isLength({ min: 1, max: 500 }).trim(),
];
