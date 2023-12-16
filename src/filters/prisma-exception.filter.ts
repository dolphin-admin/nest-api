import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpStatus } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type { Response } from 'express'
import { I18nContext } from 'nestjs-i18n'

import { R } from '@/class'
import type { I18nTranslations } from '@/generated/i18n.generated'

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const i18n = I18nContext.current<I18nTranslations>()!

    const { code } = exception

    switch (code) {
      case 'P2002':
        // 处理 Prisma Unique 字段冲突异常
        response
          .status(HttpStatus.CONFLICT)
          .json(new R({ msg: i18n.t('common.RESOURCE.CONFLICT') }))
        break
      case 'P2003':
        // 处理 Prisma 操作失败异常
        response
          .status(HttpStatus.BAD_REQUEST)
          .json(new R({ msg: i18n.t('common.OPERATE.FAILED') }))
        break
      case 'P2021':
        // 处理 Prisma 表不存在
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(new R({ msg: i18n.t('common.OPERATE.FAILED') }))
        break
      case 'P2025':
        // 处理 Prisma 资源未找到异常
        response
          .status(HttpStatus.NOT_FOUND)
          .json(new R({ msg: i18n.t('common.RESOURCE.NOT.FOUND') }))
        break
      default:
        console.log(exception)
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json()
        break
    }
  }
}
