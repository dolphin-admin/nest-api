import { Injectable, NotFoundException } from '@nestjs/common'
import type { Prisma, UserSetting } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'

import { type SortColumnKey } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'

import type { PageUserSettingDto, PatchUserSettingDto } from './dto'
import type { CreateUserSettingDto } from './dto/create-user-setting.dto'
import type { UpdateUserSettingDto } from './dto/update-user-setting.dto'
import { PageUserSettingVo, UserSettingVo } from './vo'

@Injectable()
export class UserSettingsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  private checkExists(userSetting: UserSetting | null) {
    if (!userSetting) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }
  }

  // 创建用户设置
  async create(createUserSettingDto: CreateUserSettingDto, userId: number) {
    return plainToClass(
      UserSettingVo,
      await this.prismaService.userSetting.create({
        data: {
          ...createUserSettingDto,
          createdBy: userId,
          userId
        }
      })
    )
  }

  // 设置列表
  async findMany(pageUserSettingDto: PageUserSettingDto) {
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
      id,
      userId
    } = pageUserSettingDto

    const orderBy = sortColumnKeys.map((field: SortColumnKey, index) => ({
      [field]: sortOrders[index]
    }))

    const where: Prisma.UserSettingWhereInput = {
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
          userId: {
            ...(userId && { equals: userId })
          }
        }
      ],
      OR: keywords
        ? [
            { id: { equals: _.toNumber(keywords) < 100000 ? _.toNumber(keywords) : 0 } },
            { userId: { equals: _.toNumber(keywords) < 100000 ? _.toNumber(keywords) : 0 } },
            { key: { contains: keywords } },
            { value: { contains: keywords } },
            { label: { contains: keywords } },
            { remark: { contains: keywords } }
          ]
        : undefined
    }

    const records = await this.prismaService.userSetting.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    const total = await this.prismaService.userSetting.count({ where })
    return plainToClass(PageUserSettingVo, {
      records,
      total,
      page,
      pageSize
    })
  }

  // 根据 ID 查询用户设置
  async findOneById(id: number) {
    const userSetting = await this.prismaService.userSetting.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
    this.checkExists(userSetting)
    return plainToClass(UserSettingVo, userSetting)
  }

  // 根据 Key 查询用户设置
  async findOneByKey(key: string) {
    const userSetting = await this.prismaService.userSetting.findUnique({
      where: {
        key,
        deletedAt: null
      }
    })
    this.checkExists(userSetting)
    return plainToClass(UserSettingVo, userSetting)
  }

  // 修改用户设置
  async update(id: number, updateUserSettingDto: UpdateUserSettingDto, userId: number) {
    return plainToClass(
      UserSettingVo,
      await this.prismaService.userSetting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...updateUserSettingDto,
          updatedBy: userId
        }
      })
    )
  }

  // 修改设置
  async patch(id: number, patchUserSettingDto: PatchUserSettingDto, userId: number) {
    return plainToClass(
      UserSettingVo,
      await this.prismaService.userSetting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...patchUserSettingDto,
          updatedBy: userId
        }
      })
    )
  }

  // 删除用户设置
  async remove(id: number, userId: number) {
    this.prismaService.userSetting.update({
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
}
