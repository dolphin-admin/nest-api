import { join } from 'node:path'
import { stdout } from 'node:process'

import { bootstrapLog } from '@dolphin-admin/bootstrap-animation'
import { ClassSerializerInterceptor, HttpStatus, VersioningType } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n'

import { R } from './class'
import type { AppConfig, DevConfig } from './configs'
import { HttpExceptionFilter, MongoExceptionFilter } from './filters'
import { AppModule } from './modules/app.module'
import { Logger } from './shared/logger/logger.service'
import { SwaggerUtils } from './utils'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: false,
    bufferLogs: true,
    bodyParser: true,
    logger: false
  })

  const configService = app.get(ConfigService)
  const appConfig = configService.get<ConfigType<typeof AppConfig>>('app')!
  const devConfig = configService.get<ConfigType<typeof DevConfig>>('dev')!

  app.useLogger(new Logger(appConfig))

  // 跨域白名单
  const corsOriginWhiteList = ['https://bit-ocean.studio']

  // 测试环境允许跨域
  if (appConfig.isSTAGING) {
    corsOriginWhiteList.push('http://localhost:*')
  }

  // 跨域设置
  app.enableCors({
    origin: corsOriginWhiteList, // 允许跨域的域名
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: HttpStatus.NO_CONTENT
  })

  // 全局前缀 - 如果没有子域名，可以设置全局前置
  app.setGlobalPrefix('/')

  // 启用版本控制
  app.enableVersioning({ type: VersioningType.URI })

  // 全局管道 - 验证/国际化
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true, // 自动删除非 dto 中的属性
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true // 允许隐式转换
      },
      stopAtFirstError: true, // 遇到错误立即停止
      disableErrorMessages: false // 禁用错误消息
    })
  )

  // 全局过滤器 - Mongo 异常
  app.useGlobalFilters(new MongoExceptionFilter())
  // 全局过滤器 - 异常处理
  app.useGlobalFilters(new HttpExceptionFilter())
  // 全局过滤器 - 国际化
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      responseBodyFormatter: (_host, _exc, formattedErrors) => {
        const errors = formattedErrors as string[]
        return new R({
          msg: errors[0],
          errors
        }) as Record<string, unknown>
      }
    })
  )

  // 全局拦截器 - 序列化
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  /**
   * 使用应用 shutdown 相关的生命周期，必须启用 shutdown hooks
   * - onModuleDestroy()
   * - beforeApplicationShutdown()
   * - onApplicationShutdown()
   *
   * 默认建议关闭，会占用一定的性能，仅当需要时才启用
   * @see https://docs.nestjs.com/fundamentals/lifecycle-events#application-shutdown
   */
  app.enableShutdownHooks()

  /**
   * 静态资源
   * 用作上传文件的存储目录
   * 例如：http://localhost:3000/storage/xxx.png
   */
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/' })
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' })

  /**
   * 视图目录
   * 例如：http://localhost:3000/views/xxx.pug
   */
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  // 视图引擎，使用 pug
  app.setViewEngine('pug')

  if (devConfig.enableSwagger) {
    // 启用 Swagger 文档
    SwaggerUtils.buildDocs(app)
  }

  await app.listen(appConfig.port)
}

bootstrap()
  .then(() => bootstrapLog())
  .catch((err) => stdout.write(`${err}\n`))
