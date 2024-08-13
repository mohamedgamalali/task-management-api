import { NextFunction, Request, Response } from "express";
import { createTaskSchema } from '../routes/validation-schemas';
import { z } from 'zod';
import { TaskInstance } from "../models";
import { httpError, errorCodes } from '../utils/errorHandler';
import { TaskDocument } from "../types";
import { FilterQuery } from "mongoose";
export const createTaskController = async (req: Request<object, object, z.infer<(typeof createTaskSchema)>, object >, res: Response, next: NextFunction) => {
    try {
        const { title, description, priority, status, dueDate } = req.body;

        const task = await new TaskInstance({ 
            title, description, priority, status, dueDate,
            userId: req.userId
         }).save();
        return res.status(201).json({ 
            message: 'Task created',
            task,
         });
    } catch (err) {
        next(err);
    }
}

export const getTasksController = async (req: Request<object, object,object, {page?: number, limit?: number} >, res: Response, next: NextFunction) => {
    try {
        let { page, limit } = req.query;
        page = page ?? 1;
        limit = limit ?? 10;
        const tasks = await TaskInstance.find({ userId: req.userId }).sort({ createdAt: -1 }).skip((page - 1) * limit ).limit(limit);
        const totalTasks = await TaskInstance.find({ userId: req.userId }).countDocuments();
        return res.status(200).json({
            message: 'Tasks',
            tasks,
            totalTasks,
            page,
            limit,
        });
    } catch (err) {
        next(err);
    }
}

export const getTaskByIdController = async (req: Request<{id: string}, object ,object, object >, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const task = await TaskInstance.findOne({_id: id, userId: req.userId});
        if (!task) {
            throw new httpError(404, 'Task not found with id', errorCodes.TASK_NOT_FOUND)
        }
        return res.status(200).json({
            message: 'Task',
            task,
        });
    } catch (err) {
        next(err);
    }
}

export const updateTaskController = async (req: Request<{id: string}, object ,z.infer<(typeof createTaskSchema)>, object >, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { title, description, priority, status, dueDate } = req.body;
        const task = await TaskInstance.findOne({_id: id, userId: req.userId});
        if (!task) {
            throw new httpError(404, 'Task not found with id', errorCodes.TASK_NOT_FOUND)
        }
        task.title = title;
        task.description = description;
        task.priority = priority;
        task.status = status;
        task.dueDate = dueDate;
        await task.save();
        return res.status(200).json({
            message: 'Task updated',
            task,
        });
    } catch (err) {
        next(err);
    }
}

export const deleteTaskController = async (req: Request<{id: string}, object ,object , object >, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const task = await TaskInstance.findOne({_id: id, userId: req.userId});
        if (!task) {
            throw new httpError(404, 'Task not found with id', errorCodes.TASK_NOT_FOUND)
        }
        await TaskInstance.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Task deleted',
            task,
        });
    } catch (err) {
        next(err);
    }
}

// NOTE: task filter and search can be still applied in get tasks API
export const searchTasksController = async (req: Request<object, object ,object , { searchQ?: string; page?: number, limit?: number } >, res: Response, next: NextFunction) => {
    try {
        const { searchQ } = req.query;
        let { page, limit } = req.query;
        page = page ?? 1;
        limit = limit ?? 10;
        const tasks = await TaskInstance.find({ $or: [{ title: { $regex: searchQ, $options: 'i' } }, { description: { $regex: searchQ, $options: 'i' } }] })
        .skip((page - 1) * limit ).limit(limit);
        const totalTasks = await TaskInstance.find({ $or: [{ title: { $regex: searchQ, $options: 'i' } }, { description: { $regex: searchQ, $options: 'i' } }] }).countDocuments();
        return res.status(200).json({
            message: 'Tasks',
            tasks,
            totalTasks,
            page,
            limit,
        });
    } catch (err) {
        next(err);
    }
}

export const filterTasksController = async (req: Request<object, object ,object , { priority?: string; status?: string; page?: number, limit?: number } >, res: Response, next: NextFunction) => {
    try {
        const { status, priority } = req.query;
        let { page, limit } = req.query;
        page = page ?? 1;
        limit = limit ?? 10;
        const query: FilterQuery<TaskDocument> = {}
        if (status) query.status = status
        if (priority) query.priority = priority
        const tasks = await TaskInstance.find(query)
        .skip((page - 1) * limit ).limit(limit);
        const totalTasks = await TaskInstance.find(query).countDocuments();
        return res.status(200).json({
            message: 'Tasks',
            tasks,
            totalTasks,
            page,
            limit,
        });
    } catch (err) {
        next(err);
    }
}