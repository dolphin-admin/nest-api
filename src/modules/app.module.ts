import path from 'node:path'

import { HttpModule } from '@nestjs/axios'
import { BullModule } from '@nestjs/bull'
import type { MiddlewareConsumer, NestModule } from '@nestjs/common'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { JwtModule } from '@nestjs/jwt'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'

import {
  AppConfig,
  CosConfig,
  DevConfig,
  JwtConfig,
  MongoConfig,
  NodemailerConfig,
  PostgresConfig,
  RedisConfig
} from '@/configs'
import { LanguageCode } from '@/enums'
import { AuthGuard } from '@/guards'
import { ErrorsInterceptor, LoggingInterceptor } from '@/interceptors'
import { DelayMiddleware } from '@/middlewares'

import { CosModule } from '../shared/cos/cos.module'
import { EmailModule } from '../shared/email/email.module'
import { LoggerModule } from '../shared/logger/logger.module'
import { PrismaModule } from '../shared/prisma/prisma.module'
import { RedisModule } from '../shared/redis/redis.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CronJobLogsModule } from './cron-job-logs/cron-job-logs.module'
import { CronJobsModule } from './cron-jobs/cron-jobs.module'
import { DepartmentsModule } from './departments/departments.module'
import { DictionariesModule } from './dictionaries/dictionaries.module'
import { DictionaryItemsModule } from './dictionary-items/dictionary-items.module'
import { FilesModule } from './files/files.module'
import { LocalesModule } from './locales/locales.module'
import { LoginLogsModule } from './login-logs/login-logs.module'
import { MenuItemsModule } from './menu-items/menu-items.module'
import { NotificationsModule } from './notifications/notifications.module'
import { OperationLogsModule } from './operation-logs/operation-logs.module'
import { PermissionsModule } from './permissions/permissions.module'
import { PositionsModule } from './positions/positions.module'
import { RolesModule } from './roles/roles.module'
import { SettingsModule } from './settings/settings.module'
import { SseModule } from './sse/sse.module'
import { UserSettingsModule } from './user-settings/user-settings.module'
import { UserTrafficRecordsModule } from './user-traffic-records/user-traffic-records.module'
import { UserTrafficsModule } from './user-traffics/user-traffics.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true, // 声明为全局模块
      envFilePath: ['.env'], // 指定环境变量文件
      load: [
        AppConfig,
        DevConfig,
        JwtConfig,
        PostgresConfig,
        MongoConfig,
        RedisConfig,
        NodemailerConfig,
        CosConfig
      ], // 加载配置文件
      cache: true, // 开启缓存，提高性能
      expandVariables: true // 允许变量扩展
    }),
    // Mongoose 模块
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL')
      }),
      inject: [ConfigService]
    }),
    // i18n 模块
    I18nModule.forRoot({
      fallbackLanguage: LanguageCode['en-US'],
      loaderOptions: {
        path: path.join(__dirname, '../i18n/'),
        watch: true
      },
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
      typesOutputPath: path.join(__dirname, '../../src/generated/i18n.generated.ts')
    }),
    // JWT 模块
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET')
      }),
      inject: [ConfigService]
    }),
    // 限流模块
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 5 }, // 每秒调用不超过 5 次
      { name: 'medium', ttl: 10000, limit: 50 }, // 每 10 秒调用不超过 50 次
      { name: 'long', ttl: 60000, limit: 300 } // 每分钟调用不超过 300 次
    ]),
    // 定时任务模块
    ScheduleModule.forRoot(),
    // 队列模块
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD')
        }
      }),
      inject: [ConfigService]
    }),
    // 事件模块
    EventEmitterModule.forRoot(),
    // HTTP 模块
    HttpModule.registerAsync({
      useFactory: async () => ({
        timeout: 10000,
        maxRedirects: 5
      })
    }),
    // Providers
    PrismaModule,
    RedisModule,
    EmailModule,
    LoggerModule,
    CosModule,
    // Modules
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    DepartmentsModule,
    PositionsModule,
    MenuItemsModule,
    SettingsModule,
    UserSettingsModule,
    DictionariesModule,
    DictionaryItemsModule,
    FilesModule,
    NotificationsModule,
    CronJobsModule,
    SseModule,
    UserTrafficsModule,
    UserTrafficRecordsModule,
    OperationLogsModule,
    CronJobLogsModule,
    LoginLogsModule,
    LocalesModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 注册全局限流守卫
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    // 注册全局认证守卫
    { provide: APP_GUARD, useClass: AuthGuard },
    // 注册全局日志拦截器
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    // 注册全局错误拦截器
    { provide: APP_INTERCEPTOR, useClass: ErrorsInterceptor }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(DelayMiddleware).forRoutes('*') // 应用延迟中间件，用于开发模式下模拟网络延迟
  }
}
