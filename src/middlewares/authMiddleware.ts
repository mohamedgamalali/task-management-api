import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token format is incorrect' });
        }
        const secretKey = process.env.JWT_PRIVATE_KEY;
        if (!secretKey) {
            return res.status(500).json({ message: 'Secret key not configured' });
        }
        const decoded = jwt.verify(token, secretKey);
        
        req.userId = new Types.ObjectId(decoded.user._id as string);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};