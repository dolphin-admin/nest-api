import { extname } from 'node:path'

import { Module, UnprocessableEntityException } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

import { MAX_UPLOAD_FILE_SIZE } from '@/constants'
import { fileExtensionMap } from '@/maps'
import { ValueUtils } from '@/utils'

import { CosController } from './cos.controller'
import { CosService } from './cos.service'

@Module({
  imports: [
    /**
     * TODO: 考虑使用配置文件
     * - 文件存储路径
     * - 文件大小限制
     * - 文件上传数量限制
     */
    MulterModule.registerAsync({
      useFactory: () => ({
        storage: diskStorage({
          destination: 'uploads',
          filename: (_, file, callback) =>
            callback(null, `${ValueUtils.uuid() + extname(file.originalname)}`)
        }),
        limits: {
          fileSize: MAX_UPLOAD_FILE_SIZE
        },
        fileFilter: (_req, file, callback) => {
          if (fileExtensionMap.get(file.mimetype)) {
            callback(null, true)
          } else {
            callback(new UnprocessableEntityException('无法处理的文件类型'), false)
          }
        }
      })
    })
  ],
  controllers: [CosController],
  providers: [CosService]
})
export class CosModule {}
