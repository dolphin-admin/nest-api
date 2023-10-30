import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpStatus } from '@nestjs/common'
import type { Response } from 'express'
import { I18nContext, I18nValidationException } from 'nestjs-i18n'

@Catch(I18nValidationException)
export class I18nValidationExceptionFilter implements ExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current()!

    const errorSet = new Set<string>()
    const errors = exception.errors
      .filter((error) => error.constraints)
      .map((error) => error.constraints)
    errors.forEach((error) => {
      if (!error) return
      Object.values(error).forEach((message) => {
        errorSet.add(message)
      })
    })

    const response = host.switchToHttp().getResponse<Response>()

    response.status(HttpStatus.BAD_REQUEST).send({
      message: i18n.t([...errorSet][0])
    })
  }
}
