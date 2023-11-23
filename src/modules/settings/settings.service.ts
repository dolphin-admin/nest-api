import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { SettingTrans } from '@prisma/client'
import { Prisma } from '@prisma/client'
import _ from 'lodash'

import type { SortColumnKey } from '@/enums'
import { LanguageCode, SortOrder } from '@/enums'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { I18nUtils } from '@/utils'

import type { PageSettingDto } from './dto'
import type { CreateSettingDto } from './dto/create-setting.dto'
import type { UpdateSettingDto } from './dto/update-setting.dto'

@Injectable()
export class SettingsService {
  constructor(private readonly prismaService: PrismaService) {}

  // 创建设置
  async create(createSettingDto: CreateSettingDto, userId: number) {
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
      return { ...setting, label, remark }
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

  // 设置列表
  async findMany(pageSettingDto: PageSettingDto) {
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
    return {
      data: results.map((setting) => ({
        ...setting,
        label: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'label'),
        remark: I18nUtils.generateTrans<SettingTrans>(setting.settingTrans, 'remark')
      })),
      total,
      page,
      pageSize
    }
  }

  // 根据 ID 查询设置
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

  // 根据键查询设置
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

  // 修改设置
  async update(id: number, updateSettingDto: UpdateSettingDto, userId: number) {
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
      return { ...setting, label, remark }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2025') {
          throw new NotFoundException('该设置不存在，更新失败')
        }
      }
      throw e
    }
  }

  // 启用设置
  async enable(id: number, userId: number) {
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
          throw new NotFoundException('该设置不存在，启用失败')
        }
      }
      throw e
    }
  }

  // 禁用设置
  async disable(id: number, userId: number) {
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
          throw new NotFoundException('该设置不存在，禁用失败')
        }
      }
      throw e
    }
  }

  // 排序设置
  async sort(id: number, targetId: number, userId: number) {
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
        throw new NotFoundException('设置不存在，排序失败')
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
          throw new NotFoundException('设置不存在，排序失败')
        }
      }
      throw e
    }
  }

  // 删除设置
  async remove(id: number, userId: number) {
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
