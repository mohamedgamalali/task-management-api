import { Schema, Types, model } from 'mongoose';
import { TaskDocument, TaskModel } from '../types/mongoose-types';

export const TASK_STATUS = [
    'pending',
    'in-progress',
    'completed'
] as const;
export const TASK_PRIORITY = [
    'low',
    'medium',
    'high'
] as const;
const TaskSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: TASK_STATUS,
        default: 'pending',
    },
    priority: {
        type: String,
        enum: TASK_PRIORITY,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, });

TaskSchema.index({ title: 1 });
TaskSchema.index({ userId: 1, createdAt: -1 });

export const TaskInstance = model<TaskDocument, TaskModel>('Task', TaskSchema);