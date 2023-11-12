/* eslint-disable no-console */
import { performance } from 'node:perf_hooks'
import process from 'node:process'
import util from 'node:util'

import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { PrismaClient } from '@prisma/client'

import { DevConfig } from '@/configs'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(DevConfig.KEY) private readonly devConfig: ConfigType<typeof DevConfig>) {
    super({
      log: [],
      errorFormat: 'pretty'
    })
  }

  /**
   * NOTE: 使用 OnModuleInit 来确保在应用程序启动时连接到数据库
   * 不使用 OnModuleInit 将进入懒加载模式，PrismaClient 将在第一次使用时连接到数据库
   */
  async onModuleInit() {
    await this.$connect()

    const { enablePrismaLog } = this.devConfig

    // Prisma 扩展
    Object.assign(
      this,
      this.$extends({
        query: {
          // 日志
          async $allOperations({ operation, model, args, query }) {
            const result = await query(args)
            if (!enablePrismaLog) {
              return result
            }
            const start = performance.now()
            const end = performance.now()
            const time = end - start
            process.stdout.write('------------ Prisma parameters: ------------\n')
            console.log(
              util.inspect(
                { model, operation, args, time },
                { showHidden: false, depth: null, colors: true }
              )
            )
            process.stdout.write('------------ Prisma results: ------------\n')
            console.log(result)
            return result
          },
          $allModels: {
            // 查询过滤软删除, deletedAt 是默认的软删除字段
            async findFirst({ args, query }) {
              args.where = {
                deletedAt: null,
                ...args.where
              }
              return query(args)
            },
            async findFirstOrThrow({ args, query }) {
              args.where = {
                deletedAt: null,
                ...args.where
              }
              return query(args)
            },
            async findUnique({ args, query }) {
              args.where = {
                deletedAt: null,
                ...args.where
              }
              return query(args)
            },
            async findUniqueOrThrow({ args, query }) {
              args.where = {
                deletedAt: null,
                ...args.where
              }
              return query(args)
            },
            async findMany({ args, query }) {
              args.where = {
                deletedAt: null,
                ...args.where
              }
              return query(args)
            },
            async count({ args, query }) {
              args.where = {
                deletedAt: null,
                ...args.where
              }
              return query(args)
            }
          }
        }
      })
    )
  }

  // NOTE: 使用 OnModuleDestroy 来确保在应用程序关闭时断开数据库连接
  async onModuleDestroy() {
    await this.$disconnect()
  }
}
