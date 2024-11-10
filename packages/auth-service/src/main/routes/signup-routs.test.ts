import request from 'supertest';
import app from '../config/app';

describe('SignUp Routes', () => {
  test('Should return true on success', async () => {
    app.get('/test_cors', (req, res) => {
      res.send();
    });

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Higor',
        email: 'higor@gmail.com',
        password: 'teste123',
        passwordConfirmation: 'teste123'
      })
      .expect(200)
  });
});
