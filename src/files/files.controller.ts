import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse
} from '@nestjs/swagger'
import { Response } from 'express'

import { STORAGE_DIR } from '@/common'

import { FilesService } from './files.service'
import { FileVo } from './vo'

@ApiTags('文件')
@ApiBearerAuth('bearer')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOperation({ summary: '上传文件' })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ description: '上传成功', type: FileVo, isArray: true })
  @ApiBadRequestResponse({ description: '文件为空' })
  @ApiUnprocessableEntityResponse({
    description: '文件大于 5MB | 文件类型不支持'
  })
  @ApiBody({ description: '上传的文件' })
  @UseInterceptors(AnyFilesInterceptor())
  @Post()
  upload(@UploadedFiles() files: Express.Multer.File[]) {
    return this.filesService.upload(files)
  }

  @ApiOperation({ summary: '下载文件' })
  @ApiOkResponse({ description: '下载成功' })
  @Get('download/:path')
  download(@Param('path') path: string, @Res() res: Response) {
    return res.download(`${STORAGE_DIR}/${path}`)
  }

  @ApiOperation({ summary: '获取文件' })
  @ApiOkResponse({ description: '获取成功' })
  @Get(':path')
  findOne(@Param('path') path: string, @Res() res: Response) {
    return res.sendFile(path, { root: STORAGE_DIR })
  }
}
