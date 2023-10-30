import path from 'node:path'

import { HttpModule } from '@nestjs/axios'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import Joi from 'joi'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import {
  AuthGuard,
  ErrorsInterceptor,
  LoggingInterceptor,
  TimeoutInterceptor
} from './common'
import { CosModule } from './cos/cos.module'
import { CronJobLogsModule } from './cron-job-logs/cron-job-logs.module'
import { CronJobsModule } from './cron-jobs/cron-jobs.module'
import { DepartmentsModule } from './departments/departments.module'
import { DictionariesModule } from './dictionaries/dictionaries.module'
import { DictionaryItemsModule } from './dictionary-items/dictionary-items.module'
import { FilesModule } from './files/files.module'
import { LoggerModule } from './logger/logger.module'
import { LoginLogsModule } from './login-logs/login-logs.module'
import { MenuItemsModule } from './menu-items/menu-items.module'
import { NotificationsModule } from './notifications/notifications.module'
import { OperationLogsModule } from './operation-logs/operation-logs.module'
import { PermissionsModule } from './permissions/permissions.module'
import { PositionsModule } from './positions/positions.module'
import { PrismaModule } from './prisma/prisma.module'
import { RolesModule } from './roles/roles.module'
import { SettingsModule } from './settings/settings.module'
import { UserTrafficRecordsModule } from './user-traffic-records/user-traffic-records.module'
import { UserTrafficsModule } from './user-traffics/user-traffics.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development', '.env'], // 优先匹配 .env
      isGlobal: true, // 声明为全局模块
      cache: true, // 开启缓存，提高性能
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000)
      }),
      expandVariables: true // 允许变量扩展
    }),
    // i18n 模块
    I18nModule.forRoot({
      fallbackLanguage: 'en-US',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver
      ],
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts'
      )
    }),
    // JWT 模块
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      }),
      inject: [ConfigService]
    }),
    // 限流模块
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10
      }
    ]),
    // Mongoose 模块
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL')
      }),
      inject: [ConfigService]
    }),
    // 定时任务模块
    ScheduleModule.forRoot(),
    // 队列模块
    BullModule.forRootAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT')
        }
      }),
      inject: [ConfigService]
    }),
    // 事件模块
    EventEmitterModule.forRoot(),
    // HTTP 模块
    HttpModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async () => ({
        timeout: 5000,
        maxRedirects: 5
      })
    }),
    PrismaModule,
    LoggerModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    DepartmentsModule,
    PositionsModule,
    MenuItemsModule,
    SettingsModule,
    DictionariesModule,
    DictionaryItemsModule,
    FilesModule,
    CosModule,
    NotificationsModule,
    CronJobsModule,
    UserTrafficsModule,
    UserTrafficRecordsModule,
    OperationLogsModule,
    CronJobLogsModule,
    LoginLogsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 注册全局认证守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    // 注册全局限流守卫
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    // 注册全局日志拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    // 注册全局超时拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor
    },
    // 注册全局错误拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor
    }
  ]
})
export class AppModule {}
