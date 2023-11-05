import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from 'redis'

import { REDIS_CLIENT } from '@/constants'

import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: REDIS_CLIENT,
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT')
          },
          // TODO: 身份认证
          // username: configService.get('REDIS_USER'),
          // password: configService.get('REDIS_PASSWORD'),
          database: configService.get('REDIS_DATABASE')
        })
        await client.connect()
        return client
      },
      inject: [ConfigService]
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
