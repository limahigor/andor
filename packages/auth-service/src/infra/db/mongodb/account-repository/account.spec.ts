import { MongoHelper } from "../helpers/mongo-helper"
import { AccountMongoRepository } from "./account"

describe('Account Mongo Repository', () => {

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
  
  const makeSut = (): AccountMongoRepository => new AccountMongoRepository()

  test('Should return true on success', async () => {
    const sut = makeSut()
    console.log(global.__MONGO_URI__)
    
    const status = await sut.add({
      username: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    })

    expect(status).toBe(true)
  })
})