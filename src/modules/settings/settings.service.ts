import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { LanguageCode } from '@/enums'
import { PrismaService } from '@/shared/prisma/prisma.service'

import type { CreateSettingDto } from './dto/create-setting.dto'
import type { UpdateSettingDto } from './dto/update-setting.dto'

@Injectable()
export class SettingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSettingDto: CreateSettingDto) {
    try {
      const { label, remark, ...rest } = createSettingDto
      const trans = [
        {
          label: label['zh-CN'],
          remark: remark['zh-CN'],
          lang: LanguageCode['zh-CN']
        },
        {
          label: label['en-US'],
          remark: remark['en-US'],
          lang: LanguageCode['en-US']
        }
      ]
      const setting = await this.prismaService.setting.create({
        data: {
          ...rest,
          SettingTrans: {
            createMany: {
              data: trans
            }
          }
        }
      })
      return {
        ...setting,
        label,
        remark
      }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code, meta } = e
        if (code === 'P2002') {
          if ((meta?.target as string[]).includes('key')) {
            throw new BadRequestException('键已存在')
          }
        }
      }
      throw e
    }
  }

  findMany() {
    return 'This action returns all settings'
  }

  findOneById(id: number) {
    return this.prismaService.setting.findUnique({
      where: { id },
      include: { SettingTrans: true }
    })
  }

  findOneByKey(key: string) {
    return `This action returns a #${key} setting`
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return updateSettingDto
  }

  remove(id: number) {
    return `This action removes a #${id} setting`
  }
}
