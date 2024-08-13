import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
describe('auth controller tests', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/dija-db-test-mode?directConnection=true');
    });
    describe('register tests', () => {
        it('should throw 422 if password it not strong', async () => {
            await request(app).post('/auth/register')
            .send({ username: 'mohamed', password: 'mmm' })
            .expect(422);
        });
        it('should regester new user', async () => {
            const username = `mohamed-${Date.now()}`;
            const res = await request(app).post('/auth/register')
            .send({ username, password: 'Mohamed12344.', confirmPassword: 'Mohamed12344.' })
            .expect(201);            
            expect(res.body.user.username).toBe(username);
        });
    });
    describe('login tests', () => {
        it('should throw 422', async () => {
            await request(app).post('/auth/login')
            .send({ username: 'mohamed' })
            .expect(422);
        });
        it('should login', async () => {
            const username = `mohamed-${Date.now()}`;
            const password = 'Mohamed12344.'
            await request(app).post('/auth/register')
            .send({ username, password, confirmPassword: password })
            .expect(201);
            const res = await request(app).post('/auth/login')
            .send({ username, password })
            .expect(200);
            expect(res.body.accessToken).toBeDefined();
        });
    });
    afterAll(async () =>  await mongoose.disconnect());
})