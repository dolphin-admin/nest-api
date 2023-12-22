import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createClient } from 'redis'

import { REDIS_CLIENT } from '@/constants'

import { CacheKeyService } from './cache-key.service'
import { RedisService } from './redis.service'

@Global()
@Module({
  providers: [
    RedisService,
    CacheKeyService,
    {
      provide: REDIS_CLIENT,
      async useFactory(configService: ConfigService) {
        const client = createClient({
          socket: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT')
          },
          username: configService.get('REDIS_USERNAME'),
          password: configService.get('REDIS_PASSWORD'),
          database: configService.get('REDIS_DATABASE')
        })
        await client.connect()
        return client
      },
      inject: [ConfigService]
    }
  ],
  exports: [RedisService, CacheKeyService]
})
export class RedisModule {}
