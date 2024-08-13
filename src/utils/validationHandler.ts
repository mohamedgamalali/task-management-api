import { z } from 'zod';
import { httpError, errorCodes } from './errorHandler';

export const validationHandler = (schema: z.Schema) => {
    return (req, res, next) => {
        try {
            const valid = schema.parse(req.body);
            next();
          } catch (err: any) {
            const zodError = err.errors[0];
            console.log(err.errors);
            next(new httpError(422, zodError.message, errorCodes.VALIDATION_FAILED));
          }
    }
}