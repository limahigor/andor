import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account"

describe('Account Mongo Repository', () => {

  beforeAll(async () => {
    await MongoHelper.connect(global.__MONGO_URI__ as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  
  test('Should return true on success', async () => {
    const sut = new AccountMongoRepository()
    console.log(global.__MONGO_URI__)
    
    const status = await sut.add({
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    })

    expect(status).toBe(true)
  })
})