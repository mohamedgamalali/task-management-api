import { NextFunction, Request, Response } from "express";

export class httpError {
    statusCode: number;
    message: string;
    errorCode: number;
    errorString?: string;
    constructor(statusCode: number, message: string, errorCode: number, errorString?: string) {
        this.statusCode = statusCode;
        this.message = message;
        this.errorCode = errorCode;
        this.errorString = errorString;
    }
}
export const errorCodes = {
    SUCCESS: 1,
    SERVER_ERROR: 0,
    USER_ALREADY_REGESTERED: 2,
    VALIDATION_FAILED: 3,
    WRONG_USER_NAME_OR_PASSWORD: 4,
    TASK_NOT_FOUND: 5,
}
export const errorHandler = (error: httpError, req: Request, res: Response, _next: NextFunction) => {
    console.error(`Error with ${req.method}:${req.path} ==> ${ JSON.stringify(error) }`)
    const statusCode = error.statusCode ?? 500;
    return res.status(statusCode).json({ message: error.message ?? 'Unexpected error happened', errorCode: error.errorCode ?? errorCodes.SERVER_ERROR, });
  };