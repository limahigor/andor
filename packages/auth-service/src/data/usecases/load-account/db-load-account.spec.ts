import { DbLoadAccount } from "./db-load-account"
import type { LoadAccountRepository, Hasher, CheckAccountByUsernameRepository, LoadAccountModel, Decrypter, Encrypter } from "./db-load-account-protocols"

interface SutTypes {
    sut: DbLoadAccount
    hasherStub: Hasher
    encrypterStub: Encrypter
    loadAccountRepositoryStub: LoadAccountRepository
    checkByUsernameStub: CheckAccountByUsernameRepository
}

const makeLoadAccountRepository = (): LoadAccountRepository => {
    class LoadAccountRepositoryStub implements LoadAccountRepository {
        params: LoadAccountModel.Params
        result = 'valid_token'

        async login(params: LoadAccountModel.Params): Promise<LoadAccountModel.Result> {
            this.params = params
            return this.result
        }
    }

    return new LoadAccountRepositoryStub()
}

const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        param: string
        resultEncrypt = 'valid_token'
        resultDecrypt = 'valid_id'

        async encrypt(param: string): Promise<string> {
            this.param = param
            return this.resultEncrypt
        }
    }

    return new EncrypterStub()
}

const makeHasher = (): Hasher => {
    class HasherStub implements Hasher {
        async hasher(value: string): Promise<string> {
            return 'hashed_password'
        }
    }

    return new HasherStub()
}

const makeCheckByUsernameStub = (): CheckAccountByUsernameRepository => {
    class CheckByUsernameStub implements CheckAccountByUsernameRepository {
        email: string
        result = false

        async checkByUsername(username: string): Promise<boolean> {
            this.email = username
            return this.result
        }
    }

    return new CheckByUsernameStub()
}

const makeSut = (): SutTypes => {
    const hasherStub = makeHasher()
    const encrypterStub = makeEncrypterStub()
    const loadAccountRepositoryStub = makeLoadAccountRepository()
    const checkByUsernameStub = makeCheckByUsernameStub()
    const sut = new DbLoadAccount(hasherStub, encrypterStub, loadAccountRepositoryStub, checkByUsernameStub)

    return {
        sut,
        hasherStub,
        encrypterStub,
        loadAccountRepositoryStub,
        checkByUsernameStub,
    }
}

describe('DbLoadAccount Repository', () => {
    test('Should call Encrypter with correct password', async () => {
        const { sut, hasherStub } = makeSut()
        const hasherSpy = jest.spyOn(hasherStub, 'hasher')

        const accountData = {
            username: 'valid_name',
            password: 'valid_password'
        }

        await sut.login(accountData)
        expect(hasherSpy).toHaveBeenCalledWith('valid_password')
    })
});