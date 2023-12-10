import { v4 } from 'uuid'

export class GeneratorUtils {
  /**
   * 生成 uuid
   */
  static generateUuid(): string {
    return v4()
  }

  /**
   * 生成文件名
   * @param ext 文件后缀
   */
  static generateFileName(ext: string): string {
    return `${this.generateUuid()}.${ext}`
  }

  /**
   * 生成验证码
   */
  static generateVerificationCode(): string {
    return Math.floor(1000 + Math.random() * 9000).toString()
  }

  /**
   * 生成密码
   */
  static generatePassword(): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = lowercase.toUpperCase()
    const numbers = '0123456789'
    let text = ''
    for (let i = 0; i < 4; i += 1) {
      text += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
      text += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
      text += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    return text
  }

  /**
   * 生成随机字符串
   * @param length 随机字符串长度
   */
  static generateRandomString(length: number): string {
    return Math.random()
      .toString(36)
      .replaceAll(/[^\dA-Za-z]+/g, '')
      .slice(0, Math.max(0, length))
  }
}
