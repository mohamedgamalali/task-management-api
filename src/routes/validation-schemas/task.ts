import { TASK_STATUS, TASK_PRIORITY } from '../../models';
import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string({ required_error: 'Task title is required' }),
    description: z.string({ required_error: 'Task description is required' }),
    status: z.enum(TASK_STATUS, { required_error: 'Task status is required'}),
    priority: z.enum(TASK_PRIORITY, { required_error: 'Task priority is required'}),
    dueDate: z.preprocess((arg) => {
        if (typeof arg === 'string' || arg instanceof Date) {
          const parsedDate = new Date(arg);
          if (!isNaN(parsedDate.getTime())) {
            if(parsedDate < new Date()) return undefined;
            return parsedDate;
          }
        }
        return undefined;
      }, z.date({ required_error: 'dueDate must be a valid date ahead of current date' })),
});