export class DataInUse extends Error {
  constructor () {
    super('The received email or username is already in use')
    this.name = 'DataInUse'
    this.message = 'The received email or username is already in use'
  }

  toJSON(): { name: string; message: string }{
    return {
      name: this.name,
      message: this.message,
    };
  }
}