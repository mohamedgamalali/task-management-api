import { UserDocument } from '../types';
import jwt from 'jsonwebtoken';
export const generateJWT = (user: UserDocument) => {
    return jwt.sign({ user }, process.env.JWT_PRIVATE_KEY, { expiresIn: 60 * 60 });
}