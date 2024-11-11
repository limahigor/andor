export class DataInUse extends Error {
  constructor () {
    super('The received email or username is already in use')
    this.name = 'DataInUse'
  }
}