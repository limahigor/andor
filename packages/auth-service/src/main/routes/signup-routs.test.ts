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
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  test('Should return true on success', async () => {

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await request(app)
      .post('/api/signup')
      .send({
        username: 'Higor',
        email: 'higor@gmail.com',
        password: 'teste123',
        passwordConfirmation: 'teste123'
      })
      .expect(200)
  });
});
