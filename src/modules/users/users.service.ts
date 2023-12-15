import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from '@node-rs/bcrypt'
import type { Prisma, User } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'

import type { PageUserDto, PatchUserDto, UpdatePasswordDto } from './dto'
import type { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import { PageUserVo, UserVo } from './vo'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  // 检查用户是否存在
  private checkExists(user: User | null) {
    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }
  }

  // 创建用户
  async create(createUserDto: CreateUserDto, userId?: number) {
    const { password, username } = createUserDto
    return plainToClass(
      UserVo,
      await this.prismaService.user.create({
        data: {
          username,
          password: await hash(password),
          createdBy: userId
        }
      })
    )
  }

  // 用户列表
  async findMany(pageUserDto: PageUserDto) {
    const {
      page,
      pageSize,
      keywords,
      startTime,
      endTime,
      orderBy,
      username,
      enabled,
      builtIn,
      id
    } = pageUserDto

    const where: Prisma.UserWhereInput = {
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
          username: {
            ...(username && { contains: username })
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
            { id: { equals: _.toNumber(keywords) < 100000 ? _.toNumber(keywords) : 0 } },
            { username: { contains: username } },
            { email: { contains: keywords } },
            { nickName: { contains: keywords } },
            { phoneNumber: { contains: keywords } },
            { firstName: { contains: keywords } },
            { firstName: { contains: keywords } },
            { middleName: { contains: keywords } },
            { lastName: { contains: keywords } }
          ]
        : undefined
    }

    const records = await this.prismaService.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    const total = await this.prismaService.user.count({ where })
    return plainToClass(PageUserVo, { records, total, page, pageSize })
  }

  // 根据 ID 查用户
  async findOneById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
    this.checkExists(user)
    return plainToClass(UserVo, user)
  }

  // 更新用户
  async update(id: number, updateUserDto: UpdateUserDto, userId: number) {
    console.log(updateUserDto, 'updateUserDto11111')
    const a = await this.prismaService.user.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        ...updateUserDto,
        updatedBy: userId
      }
    })
    console.log(a, 'a')
    return plainToClass(UserVo, a)
  }

  // 修改用户
  async patch(id: number, patchUserDto: PatchUserDto, userId: number) {
    const a = await this.prismaService.user.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        ...patchUserDto,
        updatedBy: userId
      }
    })
    console.log(a, 'a')
    return plainToClass(UserVo, a)
  }

  // 删除用户
  async remove(id: number, userId: number) {
    const associations = [
      'auth',
      'userRole',
      'userPosition',
      'userSetting',
      'notification',
      'userTraffic',
      'loginLog',
      'operationLog'
    ]
    const deletePromises = associations.map(async (association) => {
      const deleteManyQuery = {
        where: {
          userId: id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date().toISOString(),
          deletedBy: userId
        }
      }
      const updateItem = this.prismaService[
        association as keyof PrismaService
      ] as Prisma.UserDelegate
      return updateItem.updateMany(deleteManyQuery)
    })

    const user = this.prismaService.user.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date().toISOString(),
        deletedBy: userId
      },
      include: {
        auths: true,
        userRoles: true,
        userPositions: true,
        userSettings: true,
        notifications: true,
        userTraffics: true,
        loginLogs: true,
        operationLogs: true
      }
    })
    await Promise.all(deletePromises)
    await this.prismaService.$transaction([user])
  }

  // 更新密码
  async updatePassword(id: number, updatePasswordDto: UpdatePasswordDto, userId: number) {
    const { password } = updatePasswordDto
    return plainToClass(
      UserVo,
      await this.prismaService.user.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          password: await hash(password),
          updatedBy: userId
        }
      })
    )
  }
}
