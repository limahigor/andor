import request from 'supertest';
import app from '../config/app';

describe('Cors Middleware', () => {
  test('should enable cors', async () => {
    app.get('/test_cors', (req, res) => {
      res.send();
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  });
});
