import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import COS from 'cos-nodejs-sdk-v5'
import { sep } from 'path'

import { CosConfig } from '@/configs'
import { FileVo } from '@/modules/files/vo'

@Injectable()
export class CosService {
  private cos: COS

  private bucket: string | undefined

  private region: string | undefined

  private readonly MIN_SLICE_SIZE = 1024 * 1024 * 10

  constructor(@Inject(CosConfig.KEY) private readonly cosConfig: ConfigType<typeof CosConfig>) {
    const { secretId, secretKey, bucket, region } = this.cosConfig
    this.cos = new COS({
      SecretId: secretId,
      SecretKey: secretKey,
      FileParallelLimit: 3, // 控制文件上传并发数
      ChunkParallelLimit: 8, // 控制单个文件下分片上传并发数
      ChunkSize: 1024 * 1024 * 8, // 控制分片大小
      Proxy: '',
      Protocol: 'https:',
      FollowRedirect: false
    })
    this.bucket = bucket
    this.region = region
  }

  private checkConfig() {
    if (!this.bucket || !this.region) {
      throw new Error('COS bucket or region is empty!')
    }
  }

  uploadFile(file: Express.Multer.File) {
    this.checkConfig()
    this.cos.uploadFile(
      {
        Bucket: this.bucket!,
        Region: this.region!,
        Key: file.filename,
        FilePath: file.path,
        SliceSize: this.MIN_SLICE_SIZE,
        onTaskReady: (taskId: string) => {
          console.log(taskId)
        },
        onProgress: (progressData) => {
          console.log(JSON.stringify(progressData))
        },
        onFileFinish: (err, data, options) => {
          console.log(`${options.Key}上传${err ? '失败' : '完成'}`)
        }
      },
      (err, data) => {
        console.log('Error:', err)
        console.log('Data:', data)
      }
    )
  }

  uploadFiles(files: Express.Multer.File[]) {
    this.checkConfig()
    if (!Array.isArray(files)) {
      throw new BadRequestException('No files to upload!')
    }
    console.log(files)
    const filesResult: COS.UploadFileItemParams[] = files.map((file) => ({
      Bucket: this.bucket!,
      Region: this.region!,
      Key: file.filename,
      FilePath: file.path,
      SliceSize: this.MIN_SLICE_SIZE,
      onTaskReady: (taskId: string) => {
        console.log(taskId)
      }
    }))
    this.cos.uploadFiles(
      {
        files: filesResult,
        SliceSize: 1024 * 1024 * 10,
        onProgress: (progressData) => {
          console.log(JSON.stringify(progressData))
        },
        onFileFinish: (err, data) => {
          console.log('Error:', err)
          console.log('Data:', data)
        }
      },
      (err, data) => {
        console.log(err ?? data)
      }
    )
  }

  uploadToCos(files: Express.Multer.File[]): FileVo[] {
    this.uploadFiles(files)
    const filesResult =
      files?.map((file) => {
        const { fieldname, filename, mimetype, size, originalname } = file
        const path = file.path.replaceAll(sep, '/')
        // TODO: 使用日志记录
        console.log({
          path,
          fieldname,
          filename,
          originalname,
          mimetype,
          size
        })
        return new FileVo({
          path,
          fieldname,
          filename,
          originalname,
          mimetype,
          size
        })
      }) ?? []
    return filesResult
  }
}
