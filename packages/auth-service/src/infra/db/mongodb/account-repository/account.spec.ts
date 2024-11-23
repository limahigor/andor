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

  test('Should add return true on success', async () => {
    const sut = makeSut()
    
    const status = await sut.add({
      username: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    })

    expect(status).toBe(true)
  })

  test('Should add return true on success', async () => {
    const sut = makeSut()
    
    const status = await sut.add({
      username: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    })

    expect(status).toBe(true)
  })

  test('Should checkByEmail return true on success', async () => {
    const sut = makeSut()
    
    await sut.add({
      username: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    })

    const status = await sut.checkByEmail('any_mail@mail.com')

    expect(status).toBe(true)
  })

  test('Should checkByUsername return true on success', async () => {
    const sut = makeSut()
    
    await sut.add({
      username: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    })

    const status = await sut.checkByUsername('any_name')

    expect(status).toBe(true)
  })

  test('Should loadByUsername return LoadByUsernameResult on success', async () => {
    const sut = makeSut()

    await sut.add({
      username: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
    })
    
    const account = await sut.loadByUsername('any_name')

    expect(account).toBeTruthy()
    expect(account?.id).toBeTruthy()
    expect(account?.username).toBe('any_name')
    expect(account?.password).toBe('any_password')
  })

  test('Should loadByUsername return null if user not exist', async () => {
    const sut = makeSut()
    
    const account = await sut.loadByUsername('any_name')

    expect(account).toBeFalsy()
  })
})