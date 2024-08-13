import { validationHandler } from '../utils/validationHandler';
import { createTaskController, getTasksController, getTaskByIdController, updateTaskController, deleteTaskController, searchTasksController, filterTasksController } from '../controllers/taskController';
import { Router } from 'express';
import { createTaskSchema } from './validation-schemas';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = Router();

router.post('/', validationHandler(createTaskSchema), authMiddleware, createTaskController);
router.get('/', authMiddleware, getTasksController);
router.get('/single/:id', authMiddleware, getTaskByIdController);
router.put('/:id', validationHandler(createTaskSchema), authMiddleware, updateTaskController);
router.delete('/:id', authMiddleware, deleteTaskController);
router.get('/search', authMiddleware, searchTasksController);
router.get('/filter', authMiddleware, filterTasksController);

export default router;