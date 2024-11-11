export class InvalidUsernameOrPassword extends Error {
  constructor () {
    super('Invalid username or password')
    this.name = 'InvalidUsernameOrPassword'
  }
}