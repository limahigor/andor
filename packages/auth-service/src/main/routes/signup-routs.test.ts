import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('SignUp Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__ as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    const accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

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
