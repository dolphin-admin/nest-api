import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { SettingTrans } from '@prisma/client'
import { Prisma } from '@prisma/client'

import { LanguageCode } from '@/enums'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { I18nUtils } from '@/utils'

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
          settingTrans: {
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

  /**
   * 根据 ID 查找设置
   * @param key ID
   * @returns 设置
   */
  async findOneById(id: number) {
    const setting = await this.prismaService.setting.findUnique({
      where: { id },
      include: { settingTrans: true }
    })

    if (!setting) {
      throw new NotFoundException('设置不存在')
    }
    return {
      ...setting,
      label: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'label'),
      remark: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'remark')
    }
  }

  /**
   * 根据键查找设置
   * @param key 键
   * @returns 设置
   */
  async findOneByKey(key: string) {
    const setting = await this.prismaService.setting.findUnique({
      where: { key },
      include: { settingTrans: true }
    })
    if (!setting) {
      throw new NotFoundException('设置不存在')
    }
    return {
      ...setting,
      label: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'label'),
      remark: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'remark')
    }
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return updateSettingDto
  }

  /**
   * 删除设置
   * @description 删除设置时，会同时删除设置的多语言翻译
   */
  async remove(id: number) {
    try {
      // 删除多语言翻译
      const deleteSettingTrans = this.prismaService.settingTrans.deleteMany({
        where: {
          settingId: id
        }
      })
      // 删除设置
      const deleteSetting = this.prismaService.setting.delete({
        where: { id },
        include: { settingTrans: true }
      })
      // 事务
      await this.prismaService.$transaction([deleteSettingTrans, deleteSetting])
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2003') {
          throw new BadRequestException('删除翻译文件失败')
        }
        if (code === 'P2025') {
          throw new NotFoundException('该设置不存在，删除失败')
        }
      }
      throw e
    }
  }
}
