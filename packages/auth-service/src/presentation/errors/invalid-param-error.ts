export class InvalidParamError extends Error {
  constructor(paramName: string) {
    super(`Invalid param: ${paramName}`)
    this.name = 'InvalidParamError'
    this.message = `Invalid param: ${paramName}`
  }

  toJSON(): { name: string; message: string } {
    return {
      name: this.name,
      message: this.message,
    };
  }
}