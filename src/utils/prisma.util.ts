import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

interface ConflictKey {
  key: string
  msg: string
}

export class PrismaUtils {
  /**
   * 处理 Prisma Unique 字典冲突异常
   * @param e Prisma 异常
   * @param uniqueFieldKeys 唯一约束字段数组
   */
  static handleConflictException(e: unknown, uniqueFieldKeys: ConflictKey[]): void {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const { code, meta } = e
      if (code === 'P2002') {
        const conflictKeys = meta?.target as string[]
        const conflictKey = conflictKeys.find((key) =>
          uniqueFieldKeys.map((k) => k.key).includes(key)
        )
        if (conflictKey) {
          const { msg } = uniqueFieldKeys.find((k) => k.key === conflictKey) as ConflictKey
          throw new ConflictException(msg)
        }
      }
    }
  }

  /**
   * 处理 Prisma 操作失败异常
   * @param e Prisma 异常
   * @param msg 错误消息
   */
  static handleBadRequestException(e: unknown, msg: string): void {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const { code } = e
      if (code === 'P2003') {
        throw new BadRequestException(msg)
      }
    }
  }

  /**
   * 处理 Prisma 资源未找到异常
   * @param e Prisma 异常
   * @param msg 错误消息
   */
  static handleNotFoundException(e: unknown, msg: string): void {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      const { code } = e
      if (code === 'P2025') {
        throw new NotFoundException(msg)
      }
    }
  }
}
