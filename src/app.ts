import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { errorHandler } from './utils/errorHandler';
import authRouter from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { config } from 'dotenv';

config();
const app = express();

app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`accessed Express service router, For PATH: ${req.path} METHOD: ${req.method}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });
app.use('/auth', authRouter);
app.use('/tasks', taskRoutes);
app.use(errorHandler);

export default app;