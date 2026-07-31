import request from 'supertest';
import { createApp } from '../src/app';
import { generateAccessToken } from '../src/utils/jwt';
import { Role } from '../src/constants';

const app = createApp();

describe('Auth API & RBAC Middlewares', () => {
  it('should reject requests with missing token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('MISSING_TOKEN');
  });

  it('should reject requests with invalid token', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer invalid_token_123');
    expect(res.status).toBe(401);
  });

  it('should deny non-employee user from creating vouchers', async () => {
    const directorToken = generateAccessToken({
      userId: 'test-director-id',
      email: 'director@test.com',
      role: Role.DIRECTOR,
      name: 'Test Director',
    });

    const res = await request(app)
      .post('/api/v1/vouchers')
      .set('Authorization', `Bearer ${directorToken}`)
      .send({
        expenseDate: '2026-07-31',
        department: 'Engineering',
        expenseTitle: 'Test Title',
        expenseCategory: 'Software & Subscriptions',
        amount: 100,
      });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('ROLE_NOT_AUTHORIZED');
  });

  it('should deny non-director user from approving vouchers', async () => {
    const employeeToken = generateAccessToken({
      userId: 'test-emp-id',
      email: 'emp@test.com',
      role: Role.EMPLOYEE,
      name: 'Test Employee',
    });

    const res = await request(app)
      .post('/api/v1/vouchers/dummy-voucher-id/approve')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        directorSignatureUrl: 'data:image/png;base64,xxx',
      });

    expect(res.status).toBe(403);
  });
});
