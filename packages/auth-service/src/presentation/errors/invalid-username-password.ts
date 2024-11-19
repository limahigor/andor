export class InvalidUsernameOrPassword extends Error {
  constructor () {
    super('Invalid username or password')
    this.name = 'InvalidUsernameOrPassword'
    this.message = 'Invalid username or password'
  }

  toJSON(): { name: string; message: string }{
    return {
      name: this.name,
      message: this.message,
    };
  }
}