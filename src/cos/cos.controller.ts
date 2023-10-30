import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger'

import { FileVo } from '@/files/vo'

import { CosService } from './cos.service'

@Controller('cos')
export class CosController {
  constructor(private readonly cosService: CosService) {}

  @ApiOperation({ summary: '上传文件 (腾讯云COS)' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: '上传成功', type: FileVo, isArray: true })
  @ApiBadRequestResponse({ description: '文件为空' })
  @ApiUnprocessableEntityResponse({
    description: '文件大于 5MB | 文件类型不支持'
  })
  @ApiBody({ description: '上传的文件' })
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  uploadToCos(@UploadedFiles() files: Express.Multer.File[]) {
    return this.cosService.uploadToCos(files)
  }
}
