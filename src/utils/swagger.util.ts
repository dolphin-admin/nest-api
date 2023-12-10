import type { ConfigType } from '@nestjs/config'
import { ConfigService } from '@nestjs/config'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import type { AppConfig } from '@/configs'

export class SwaggerUtils {
  static async buildDocs(app: NestExpressApplication) {
    const configService = app.get(ConfigService)
    const appConfig = configService.get<ConfigType<typeof AppConfig>>('app')!

    // Swagger 配置
    const config = new DocumentBuilder()
      .setTitle(appConfig.name)
      .setDescription(
        `<p>Dolphin Admin 后台管理系统的接口文档 Nest 版本，基于 Nest.js + TypeScript + Prisma + PostgreSQL。</p>
  <p>Apifox 线上地址：<a>https://dolphin-admin-nest.apifox.cn/</a></p>`
      )
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        description: '基于 JWT 认证',
        name: 'bearer'
      })
      .build()
    await SwaggerModule.loadPluginMetadata(() => import('../metadata'))
    const document = SwaggerModule.createDocument(app, config, {})

    /**
     * 文档地址为 /api
     * 例如：http://localhost:3000/api/docs
     * Swagger JSON 地址为 /api/docs-json
     * 例如：http://localhost:3000/api/docs-json
     */
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        displayOperationId: true, // 显示操作 ID
        defaultModelsExpandDepth: 3, // 默认模型展开深度
        defaultModelExpandDepth: 3, // 默认模型展开深度
        docExpansion: 'list', // 折叠 ["list"*, "full", "none"]
        filter: true, // 显示过滤
        syntaxHighlight: {
          activated: true,
          theme: 'monokai' // ["agate"*, "arta", "monokai", "nord", "obsidian", "tomorrow-night", "idea"]
        }, // 语法高亮
        tryItOutEnabled: false, // 自动启用尝试
        // maxDisplayedTags: 10, // 最大显示标签数量，不启用显示全部
        displayRequestDuration: true, // 显示请求持续时间
        persistAuthorization: true // 持久化授权
      }
    })
  }
}
