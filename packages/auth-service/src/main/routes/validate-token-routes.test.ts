import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';

describe('ValidateToken Routes', () => {

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

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const httpResponse = await request(app)
      .post('/api/login')
      .send({
        username: 'Higor',
        password: 'teste123'
      })
      .expect(200)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await request(app)
      .post('/api/validate')
      .send({
        token: httpResponse.body
      })
      .expect(200)
  });

  test('Should return 404 on invalid token', async () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    await request(app)
      .post('/api/validate')
      .send({
        token: 'any_token'
      })
      .expect(404)
  });
})