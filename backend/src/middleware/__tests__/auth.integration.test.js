import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { requireAuth } from '../auth';
import jwt from 'jsonwebtoken';

const app = express();
app.get('/test', requireAuth, (req, res) => {
  res.status(200).json({ message: 'Success!', user: req.user });
});

describe('requireAuth Integration Tests', () => {
  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('should return 401 if the token is invalid', async () => {
    const res = await request(app)
      .get('/test')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid or expired token');
  });

  it('should return 200 and the user payload if the token is valid', async () => {
    const userPayload = { id: 1, role: 'Admin' };
    const token = jwt.sign(userPayload, process.env.SECRET_KEY);
    const res = await request(app)
      .get('/test')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Success!');
    expect(res.body.user).toMatchObject(userPayload);
  });
});
