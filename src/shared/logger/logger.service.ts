import { Inject, Injectable, type LoggerService } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import dayjs from 'dayjs'
import pc from 'picocolors'
import { stdout } from 'process'

import { AppConfig } from '@/configs'

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal'

@Injectable()
export class Logger implements LoggerService {
  constructor(@Inject(AppConfig.KEY) private readonly appConfig: ConfigType<typeof AppConfig>) {}

  private lastTimestamp: number = Date.now()

  private getTimestampDiff() {
    const now = Date.now()
    const result = now - this.lastTimestamp
    this.lastTimestamp = now
    return `${result}ms`
  }

  log(message: any, context?: string, ...optionalParams: any[]) {
    this.print('log', message, context, ...optionalParams)
  }

  error(message: any, context?: string, ...optionalParams: any[]) {
    this.print('error', message, context, ...optionalParams)
  }

  warn(message: any, context?: string, ...optionalParams: any[]) {
    this.print('warn', message, context, ...optionalParams)
  }

  debug(message: any, context?: string, ...optionalParams: any[]) {
    this.print('debug', message, context, ...optionalParams)
  }

  verbose(message: any, context?: string, ...optionalParams: any[]) {
    this.print('verbose', message, context, ...optionalParams)
  }

  fatal(message: any, context?: string, ...optionalParams: any[]) {
    this.print('fatal', message, context, ...optionalParams)
  }

  private print(level: LogLevel, message: any, context?: string, ...optionalParams: any[]) {
    const { name } = this.appConfig
    const levelColor = this.getColorByLogLevel(level)
    const printLogLevel = pc.italic(levelColor(`${level.toUpperCase()}`))
    const printCurrentTime = `- ${pc.dim(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))}`
    const printContext = context ? pc.blue(`[${context}]`) : pc.blue(`[${name}]`)
    const printMessage = levelColor(message)
    const printParams = optionalParams.map((param) => pc.green(param))
    const printTimestampDiff = pc.dim(`- ${this.getTimestampDiff()}\n`)
    stdout.write(printLogLevel)
    stdout.write(' ')
    stdout.write(printCurrentTime)
    stdout.write(' ')
    stdout.write(printContext)
    stdout.write(' ')
    stdout.write(printMessage)
    stdout.write(' ')
    stdout.write(printParams.join(' '))
    stdout.write(printTimestampDiff)
  }

  private getColorByLogLevel(level: LogLevel) {
    switch (level) {
      case 'error':
        return pc.red
      case 'warn':
        return pc.yellow
      case 'debug':
        return pc.blue
      case 'verbose':
        return pc.gray
      case 'fatal':
        return pc.red
      case 'log':
      default:
        return pc.green
    }
  }
}
