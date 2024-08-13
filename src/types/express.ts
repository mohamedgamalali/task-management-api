import core from 'express-serve-static-core';
import { Types } from 'mongoose';


export interface Request<
  P = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query & any,
  Locals extends Record<string, any> = Record<string, any>,
> extends core.Request<P, ResBody, ReqBody, ReqQuery, Locals>
 {}

declare module 'express-serve-static-core' {
  interface Request {
    multiValueQuery: core.Query & any;
    userId: Types.ObjectId;
  }
}