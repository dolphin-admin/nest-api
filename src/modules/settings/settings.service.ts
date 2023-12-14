import { Injectable, NotFoundException } from '@nestjs/common'
import type { Prisma, Setting } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'

import type { SortColumnKey } from '@/enums'
import { SortOrder } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'

import type { PageSettingDto } from './dto'
import type { CreateSettingDto } from './dto/create-setting.dto'
import type { PatchSettingDto } from './dto/patch-setting.dto'
import type { UpdateSettingDto } from './dto/update-setting.dto'
import { SettingVo } from './vo'
import { PageSettingVo } from './vo/page-setting.vo'

@Injectable()
export class SettingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  // 检查字典是否存在
  private checkExists(setting: Setting | null) {
    if (!setting) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }
  }

  // 创建设置
  async create(createSettingDto: CreateSettingDto, userId: number) {
    return plainToClass(
      SettingVo,
      await this.prismaService.setting.create({
        data: {
          ...createSettingDto,
          createdBy: userId
        }
      })
    )
  }

  // 设置列表
  async findMany(pageSettingDto: PageSettingDto) {
    const {
      page,
      pageSize,
      keywords,
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
      deletedAt: null,
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
      OR: keywords
        ? [
            { key: { contains: keywords } },
            { value: { contains: keywords } },
            { id: { equals: _.toNumber(keywords) < 100000 ? _.toNumber(keywords) : 0 } }
          ]
        : undefined
    }

    const records = await this.prismaService.setting.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    const total = await this.prismaService.setting.count({ where })
    return plainToClass(PageSettingVo, {
      records,
      total,
      page,
      pageSize
    })
  }

  // 根据 ID 查询设置
  async findOneById(id: number) {
    const setting = await this.prismaService.setting.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
    this.checkExists(setting)
    return plainToClass(SettingVo, setting)
  }

  // 根据键查询设置
  async findOneByKey(key: string) {
    const setting = await this.prismaService.setting.findUnique({
      where: {
        key,
        deletedAt: null
      }
    })
    this.checkExists(setting)
    return plainToClass(SettingVo, setting)
  }

  // 更新设置
  async update(id: number, updateSettingDto: UpdateSettingDto, userId: number) {
    return plainToClass(
      SettingVo,
      await this.prismaService.setting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...updateSettingDto,
          updatedBy: userId
        }
      })
    )
  }

  // 修改设置
  async patch(id: number, patchSettingDto: PatchSettingDto, userId: number) {
    return plainToClass(
      SettingVo,
      await this.prismaService.setting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...patchSettingDto,
          updatedBy: userId
        }
      })
    )
  }

  // 删除设置
  async remove(id: number, userId: number): Promise<void> {
    await this.prismaService.setting.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date().toISOString(),
        deletedBy: userId
      }
    })
  }

  // 排序设置
  async sort(id: number, targetId: number, userId: number): Promise<void> {
    const [currentItem, targetItem] = await Promise.all([
      this.prismaService.setting.findUnique({
        where: {
          id,
          deletedAt: null
        }
      }),
      this.prismaService.setting.findUnique({
        where: {
          id: targetId,
          deletedAt: null
        }
      })
    ])

    if (!currentItem || !targetItem) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }

    const currentSort = currentItem.sort ?? 0
    const targetSort = targetItem.sort ?? 0

    // 计算插入位置
    const insertSort = targetSort <= currentSort ? targetSort : targetSort - 1

    // 更新当前设置的排序
    const sortCurrent = this.prismaService.setting.update({
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
        deletedAt: null,
        sort: {
          ...(targetSort < currentSort
            ? { gte: targetSort, lt: currentSort }
            : { gt: currentSort, lte: targetSort })
        }
      },
      orderBy: [{ sort: SortOrder.ASC }, { createdAt: SortOrder.DESC }]
    })

    // 更新其他设置的排序
    const sortOthers = this.prismaService.setting.updateMany({
      where: {
        deletedAt: null,
        id: { in: settingsToUpdate.map((setting) => setting.id) }
      },
      data: {
        sort: { ...(targetSort < currentSort ? { increment: 1 } : { decrement: 1 }) },
        updatedBy: userId
      }
    })

    await this.prismaService.$transaction([sortCurrent, sortOthers])
  }
}
