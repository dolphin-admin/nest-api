export class EnvUndefinedError extends Error {
  constructor(envName: string) {
    super(`${envName} 未定义，请在 .env 文件中定义`)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
