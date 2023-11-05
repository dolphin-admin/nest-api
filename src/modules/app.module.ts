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
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'

import {
  AppConfig,
  CosConfig,
  JwtConfig,
  MongoConfig,
  PostgresConfig,
  RedisConfig
} from '@/configs'
import { AuthGuard } from '@/guards'
import { ErrorsInterceptor, LoggingInterceptor } from '@/interceptors'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
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
import { SseModule } from './sse/sse.module'
import { UserTrafficRecordsModule } from './user-traffic-records/user-traffic-records.module'
import { UserTrafficsModule } from './user-traffics/user-traffics.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true, // 声明为全局模块
      envFilePath: ['.env'], // 指定环境变量文件
      load: [AppConfig, JwtConfig, PostgresConfig, MongoConfig, RedisConfig, CosConfig], // 加载配置文件
      cache: true, // 开启缓存，提高性能
      expandVariables: true // 允许变量扩展
    }),
    // i18n 模块
    I18nModule.forRoot({
      fallbackLanguage: 'en-US',
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
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }
      }),
      inject: [ConfigService]
    }),
    // 限流模块
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 20
      }
    ]),
    // Mongoose 模块
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
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
    SseModule,
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
    // 注册全局错误拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor
    }
  ]
})
export class AppModule {}
