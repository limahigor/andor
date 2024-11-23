export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`)
    this.name = 'MissingParamError'
    this.message = `Missing param: ${paramName}`
  }

  toJSON(): { name: string; message: string }{
    return {
      name: this.name,
      message: this.message,
    };
  }
}