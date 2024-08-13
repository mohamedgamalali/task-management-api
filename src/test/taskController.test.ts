import mongoose, { Types } from 'mongoose';
import request from 'supertest';
import app from '../app';

describe('task controller tests', () => {
  let accessToken: string;

  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/dija-db-test-mode?directConnection=true');
    
    const username = `testuser-${Date.now()}`;
    const password = 'TestUser123!';
    await request(app)
      .post('/auth/register')
      .send({ username, password, confirmPassword: password })
      .expect(201);

    const loginRes = await request(app)
      .post('/auth/login')
      .send({ username, password })
      .expect(200);
      
    accessToken = loginRes.body.accessToken;
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
        
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date(Date.now() + 100000),
      };

      const res = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(taskData)
        .expect(201);

      expect(res.body.task).toHaveProperty('_id');
      expect(res.body.task.title).toBe(taskData.title);
    });

    it('should return 422 if required fields are missing', async () => {
      await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Incomplete Task' })
        .expect(422);
    });
  });

  describe('GET /tasks', () => {
    it('should get all tasks', async () => {
      const res = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.tasks).toBeInstanceOf(Array);
    });

    it('should return paginated tasks', async () => {
      const res = await request(app)
        .get('/tasks?page=1&limit=1')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.tasks.length).toBeLessThanOrEqual(1);
    });
  });

  describe('GET /tasks/single/:id', () => {
    let taskId: string;

    beforeAll(async () => {
      const taskRes = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Task to Retrieve',
          description: 'This task will be retrieved',
          status: 'pending',
          priority: 'low',
          dueDate: new Date(Date.now() + 100000),
        })
        .expect(201);
      taskId = taskRes.body.task._id;
    });

    it('should get task by ID', async () => {
        
      const res = await request(app)
        .get(`/tasks/single/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.task._id).toBe(taskId);
    });

    it('should return 404 if task not found', async () => {
      await request(app)
        .get(`/tasks/single/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PUT /tasks/:id', () => {
    let taskId: string;

    beforeAll(async () => {
      const taskRes = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Task to Update',
          description: 'This task will be updated',
          status: 'pending',
          priority: 'medium',
          dueDate: new Date(Date.now() + 100000),
        })
        .expect(201);
      taskId = taskRes.body.task._id;
    });

    it('should update task by ID', async () => {
      const updatedData = {
        title: 'Updated Task',
        status: 'in-progress',
        description: 'This task will be updated',
        priority: 'medium',
        dueDate: new Date(Date.now() + 100000),
      };

      const res = await request(app)
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedData)
        .expect(200);

      expect(res.body.task.title).toBe(updatedData.title);
      expect(res.body.task.status).toBe(updatedData.status);
    });

    it('should return 404 if task not found', async () => {
      await request(app)
        .put(`/tasks/single/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Non-existent Task' })
        .expect(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    let taskId: string;

    beforeAll(async () => {
      const taskRes = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Task to Delete',
          description: 'This task will be deleted',
          status: 'completed',
          priority: 'low',
          dueDate: new Date(Date.now() + 100000),
        })
        .expect(201);
      taskId = taskRes.body.task._id;
    });

    it('should delete task by ID', async () => {
      await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 if task not found', async () => {
      await request(app)
        .delete(`/tasks/${new Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /tasks/search', () => {
    it('should search tasks by title', async () => {
      const res = await request(app)
        .get('/tasks/search?searchQ=Test')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.tasks).toBeInstanceOf(Array);
    });
  });

  describe('GET /tasks/filter', () => {
    it('should filter tasks by status and priority', async () => {
      const res = await request(app)
        .get('/tasks/filter?status=pending&priority=medium')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.tasks).toBeInstanceOf(Array);
      res.body.tasks.forEach((task) => {
        expect(task.status).toBe('pending');
        expect(task.priority).toBe('medium');
      });
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
