import { NextFunction, Request, Response } from "express";
import { registerSchema, loginSchema } from '../routes/validation-schemas';
import { z } from 'zod';
import { UserInstance } from "../models";
import bcrypt from 'bcrypt';
import { httpError, errorCodes } from '../utils/errorHandler';
import { generateJWT } from "../utils/auth";
export const registerController = async (req: Request<object, object, z.infer<(typeof registerSchema)>, object >, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const isCurrentUser = await UserInstance.findOne({ username });
        if (isCurrentUser) {
            throw new httpError(409, 'User allready registered with username', errorCodes.USER_ALREADY_REGESTERED);
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const user = await new UserInstance({
            username,
            password: hashedPass,
        }).save();
        return res.status(201).json({
            success: true,
            user,
            message: 'User registered successfully',
            accessToken: generateJWT(user),
        });
    } catch (err) {
        next(err);
    }
}

export const loginController = async (req: Request<object, object, z.infer<(typeof loginSchema)>, object >, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const user = await UserInstance.findOne({ username });
        if (!user) {
            throw new httpError(401, 'Wrong username or password', errorCodes.WRONG_USER_NAME_OR_PASSWORD);
        }
        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) {
            throw new httpError(401, 'Wrong username or password', errorCodes.WRONG_USER_NAME_OR_PASSWORD);
        }
        return res.status(200).json({
            success: true,
            user,
            accessToken: generateJWT(user),
        });
    } catch (err) {
        next(err);
    }
}