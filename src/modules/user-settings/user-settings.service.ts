import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import type { UserSettingTrans } from '@prisma/client'
import { Prisma } from '@prisma/client'
import _ from 'lodash'

import { LanguageCode, type SortColumnKey } from '@/enums'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { I18nUtils } from '@/utils'

import type { PageUserSettingDto } from './dto'
import type { CreateUserSettingDto } from './dto/create-user-setting.dto'
import type { UpdateUserSettingDto } from './dto/update-user-setting.dto'

@Injectable()
export class UserSettingsService {
  constructor(private readonly prismaService: PrismaService) {}

  // 创建用户设置
  async create(createUserSettingDto: CreateUserSettingDto, userId: number) {
    try {
      const { label, remark, ...rest } = createUserSettingDto
      const userSetting = await this.prismaService.userSetting.create({
        data: {
          ...rest,
          createdBy: userId,
          userId,
          userSettingTrans: {
            createMany: {
              data: [
                {
                  label: label['zh-CN'],
                  remark: remark['zh-CN'],
                  lang: 'zh-CN',
                  createdBy: userId
                },
                {
                  label: label['en-US'],
                  remark: remark['en-US'],
                  lang: 'en-US',
                  createdBy: userId
                }
              ]
            }
          }
        }
      })
      return { ...userSetting, label, remark }
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
  async findMany(pageUserSettingDto: PageUserSettingDto) {
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
      id,
      userId
    } = pageUserSettingDto

    const orderBy = sortColumnKeys.map((field: SortColumnKey, index) => ({
      [field]: sortOrders[index]
    }))

    const where: Prisma.UserSettingWhereInput = {
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
          },
          userId: {
            ...(userId && { equals: userId })
          }
        }
      ],
      OR: searchText
        ? [
            { key: { contains: searchText } },
            { value: { contains: searchText } },
            { id: { equals: _.toSafeInteger(searchText) } },
            { userId: { equals: _.toSafeInteger(searchText) } }
          ]
        : undefined
    }

    const results = await this.prismaService.userSetting.findMany({
      where,
      include: {
        userSettingTrans: {
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

    const total = await this.prismaService.userSetting.count({ where })
    return {
      data: results.map((userSetting) => ({
        ...userSetting,
        label: I18nUtils.generateTrans<UserSettingTrans>(userSetting.userSettingTrans, 'label'),
        remark: I18nUtils.generateTrans<UserSettingTrans>(userSetting.userSettingTrans, 'remark')
      })),
      total,
      page,
      pageSize
    }
  }

  // 根据 ID 查询用户设置
  async findOneById(id: number) {
    const userSetting = await this.prismaService.userSetting.findUnique({
      where: { id },
      include: { userSettingTrans: true }
    })
    if (!userSetting) {
      throw new NotFoundException('用户设置不存在')
    }
    return {
      ...userSetting,
      label: I18nUtils.generateTrans<UserSettingTrans>(userSetting.userSettingTrans, 'label'),
      remark: I18nUtils.generateTrans<UserSettingTrans>(userSetting.userSettingTrans, 'remark')
    }
  }

  // 根据 Key 查询用户设置
  async findOneByKey(key: string) {
    const userSetting = await this.prismaService.userSetting.findUnique({
      where: { key },
      include: { userSettingTrans: true }
    })
    if (!userSetting) {
      throw new NotFoundException('用户设置不存在')
    }
    return {
      ...userSetting,
      label: I18nUtils.generateTrans<UserSettingTrans>(userSetting.userSettingTrans, 'label'),
      remark: I18nUtils.generateTrans<UserSettingTrans>(userSetting.userSettingTrans, 'remark')
    }
  }

  // 修改用户设置
  async update(id: number, updateUserSettingDto: UpdateUserSettingDto, userId: number) {
    const { label, remark, ...rest } = updateUserSettingDto
    try {
      const userSetting = await this.prismaService.userSetting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...rest,
          updatedBy: userId,
          userSettingTrans: {
            updateMany: [
              {
                where: {
                  userSettingId: id,
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
                  userSettingId: id,
                  lang: LanguageCode['en-US'],
                  deletedAt: null
                },
                data: { label: label['en-US'], remark: remark['en-US'], updatedBy: userId }
              }
            ]
          }
        }
      })
      return { ...userSetting, label, remark }
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2025') {
          throw new NotFoundException('该用户设置不存在，更新失败')
        }
      }
      throw e
    }
  }

  // 删除用户设置
  async remove(id: number, userId: number) {
    try {
      // 删除多语言翻译
      const deleteUserSettingTrans = this.prismaService.userSettingTrans.updateMany({
        where: {
          userSettingId: id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date().toISOString(),
          deletedBy: userId
        }
      })
      // 删除设置
      const deleteUserSetting = this.prismaService.userSetting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date().toISOString(),
          deletedBy: userId
        }
      })
      await this.prismaService.$transaction([deleteUserSettingTrans, deleteUserSetting])
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2003') {
          throw new BadRequestException('删除翻译文件失败')
        }
        if (code === 'P2025') {
          throw new NotFoundException('该用户设置不存在，删除失败')
        }
      }
      throw e
    }
  }
}
