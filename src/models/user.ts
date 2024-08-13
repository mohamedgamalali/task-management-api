import { Schema, model } from 'mongoose';
import { UserDocument, UserModel } from '../types/mongoose-types';
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, });

UserSchema.index({ username: 1 }, { unique: true });

export const UserInstance = model<UserDocument, UserModel>('User', UserSchema);