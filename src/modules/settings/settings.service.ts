import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { SettingTrans } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nService } from 'nestjs-i18n'

import type { SortColumnKey } from '@/enums'
import { LanguageCode, SortOrder } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { I18nUtils } from '@/utils'

import type { PageSettingDto } from './dto'
import type { CreateSettingDto } from './dto/create-setting.dto'
import type { UpdateSettingDto } from './dto/update-setting.dto'
import { SettingVo } from './vo'
import { PageSettingVo } from './vo/page-setting.vo'

@Injectable()
export class SettingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  // 创建设置
  async create(createSettingDto: CreateSettingDto, userId: number): Promise<SettingVo> {
    try {
      const { label, remark, ...rest } = createSettingDto
      const setting = await this.prismaService.setting.create({
        data: {
          ...rest,
          createdBy: userId,
          settingTrans: {
            createMany: {
              data: [
                {
                  label: label['zh-CN'],
                  remark: remark['zh-CN'],
                  lang: LanguageCode['zh-CN'],
                  createdBy: userId
                },
                {
                  label: label['en-US'],
                  remark: remark['en-US'],
                  lang: LanguageCode['en-US'],
                  createdBy: userId
                }
              ]
            }
          }
        }
      })
      return plainToClass(SettingVo, { ...setting, label, remark })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code, meta } = e
        if (code === 'P2002') {
          if ((meta?.target as string[]).includes('key')) {
            throw new BadRequestException(this.i18nService.t('common.RESOURCE.CONFLICT'))
          }
        }
      }
      throw e
    }
  }

  // 设置列表
  async findMany(pageSettingDto: PageSettingDto): Promise<PageSettingVo> {
    const {
      page,
      pageSize,
      searchText,
      startTime,
      endTime,
      sortColumnKeys,
      sortOrders,
      key,
      value,
      enabled,
      builtIn,
      id
    } = pageSettingDto

    const orderBy = sortColumnKeys.map((field: SortColumnKey, index) => ({
      [field]: sortOrders[index]
    }))

    const where: Prisma.SettingWhereInput = {
      AND: [
        {
          createdAt: {
            ...(startTime && { gte: startTime }),
            ...(endTime && { lte: endTime })
          },
          id: {
            ...(id && { equals: id })
          },
          key: {
            ...(key && { contains: key })
          },
          value: {
            ...(value && { contains: value })
          },
          enabled: {
            ...(enabled && { equals: enabled })
          },
          builtIn: {
            ...(builtIn && { equals: builtIn })
          }
        }
      ],
      OR: searchText
        ? [
            { key: { contains: searchText } },
            { value: { contains: searchText } },
            { id: { equals: _.toNumber(searchText) < 100000 ? _.toNumber(searchText) : 0 } }
          ]
        : undefined
    }

    const results = await this.prismaService.setting.findMany({
      where,
      include: {
        settingTrans: {
          where: {
            deletedAt: null
          },
          select: {
            label: true,
            remark: true,
            lang: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    const total = await this.prismaService.setting.count({ where })
    return plainToClass(PageSettingVo, {
      records: results.map((setting) => ({
        ...setting,
        label: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'label'),
        remark: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'remark')
      })),
      total,
      page,
      pageSize
    })
  }

  // 根据 ID 查询设置
  async findOneById(id: number): Promise<SettingVo> {
    const setting = await this.prismaService.setting.findUnique({
      where: { id },
      include: { settingTrans: true }
    })
    if (!setting) {
      throw new NotFoundException('设置不存在')
    }
    return plainToClass(SettingVo, {
      ...setting,
      label: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'label'),
      remark: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'remark')
    })
  }

  // 根据键查询设置
  async findOneByKey(key: string): Promise<SettingVo> {
    const setting = await this.prismaService.setting.findUnique({
      where: { key },
      include: { settingTrans: true }
    })
    if (!setting) {
      throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
    }
    return plainToClass(SettingVo, {
      ...setting,
      label: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'label'),
      remark: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'remark')
    })
  }

  // 修改设置
  async update(id: number, updateSettingDto: UpdateSettingDto, userId: number): Promise<SettingVo> {
    const { label, remark, ...rest } = updateSettingDto
    try {
      const setting = await this.prismaService.setting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...rest,
          updatedBy: userId,
          settingTrans: {
            updateMany: [
              {
                where: {
                  settingId: id,
                  lang: LanguageCode['zh-CN'],
                  deletedAt: null
                },
                data: {
                  label: label['zh-CN'],
                  remark: remark['zh-CN'],
                  updatedBy: userId
                }
              },
              {
                where: {
                  settingId: id,
                  lang: LanguageCode['en-US'],
                  deletedAt: null
                },
                data: {
                  label: label['en-US'],
                  remark: remark['en-US'],
                  updatedBy: userId
                }
              }
            ]
          }
        }
      })
      return plainToClass(SettingVo, { ...setting, label, remark })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2025') {
          throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
        }
      }
      throw e
    }
  }

  // 启用设置
  async enable(id: number, userId: number): Promise<void> {
    try {
      await this.prismaService.setting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          enabled: true,
          updatedBy: userId
        }
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2025') {
          throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
        }
      }
      throw e
    }
  }

  // 禁用设置
  async disable(id: number, userId: number): Promise<void> {
    try {
      await this.prismaService.setting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          enabled: false,
          updatedBy: userId
        }
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2025') {
          throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
        }
      }
      throw e
    }
  }

  // 删除设置
  async remove(id: number, userId: number): Promise<void> {
    try {
      // 删除多语言翻译
      const deleteSettingTrans = this.prismaService.settingTrans.updateMany({
        where: {
          settingId: id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date().toISOString(),
          deletedBy: userId
        }
      })
      // 删除设置
      const deleteSetting = this.prismaService.setting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date().toISOString(),
          deletedBy: userId
        }
      })
      await this.prismaService.$transaction([deleteSettingTrans, deleteSetting])
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2003') {
          throw new BadRequestException(this.i18nService.t('common.DELETE.FAILED'))
        }
        if (code === 'P2025') {
          throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
        }
      }
      throw e
    }
  }

  // 排序设置
  async sort(id: number, targetId: number, userId: number): Promise<void> {
    try {
      const [currentItem, targetItem] = await Promise.all([
        this.prismaService.setting.findUnique({
          where: {
            id
          }
        }),
        this.prismaService.setting.findUnique({
          where: {
            id: targetId
          }
        })
      ])

      if (!currentItem || !targetItem) {
        throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
      }

      const currentSort = currentItem.sort ?? 0
      const targetSort = targetItem.sort ?? 0

      // 计算插入位置
      const insertSort = targetSort <= currentSort ? targetSort : targetSort - 1

      // 更新当前设置的排序
      await this.prismaService.setting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          sort: insertSort,
          updatedBy: userId
        }
      })

      // 查询排序范围内的设置记录
      const settingsToUpdate = await this.prismaService.setting.findMany({
        where: {
          id: { not: id },
          sort: {
            ...(targetSort < currentSort
              ? { gte: targetSort, lt: currentSort }
              : { gt: currentSort, lte: targetSort })
          }
        },
        orderBy: [{ sort: SortOrder.ASC }, { createdAt: SortOrder.DESC }]
      })

      // 更新其他设置的排序
      await this.prismaService.setting.updateMany({
        where: {
          deletedAt: null,
          id: { in: settingsToUpdate.map((setting) => setting.id) }
        },
        data: {
          sort: { ...(targetSort < currentSort ? { increment: 1 } : { decrement: 1 }) },
          updatedBy: userId
        }
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2025') {
          throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
        }
      }
      throw e
    }
  }
}
