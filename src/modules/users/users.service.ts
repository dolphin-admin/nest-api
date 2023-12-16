import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from '@node-rs/bcrypt'
import type { Prisma } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'

import type { PageUserDto, PatchUserDto } from './dto'
import type { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import { PageUserVo, UserVo } from './vo'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: number) {
    return plainToClass(
      UserVo,
      await this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await hash(createUserDto.password),
          createdBy
        }
      })
    )
  }

  async findMany(pageUserDto: PageUserDto) {
    const { page, pageSize, keywords, startTime, endTime, orderBy, enabled, id } = pageUserDto

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
          enabled: {
            ...(enabled && { equals: enabled })
          }
        }
      ],
      OR: keywords
        ? [
            { id: { equals: _.toNumber(keywords) < 100000 ? _.toNumber(keywords) : 0 } },
            { username: { contains: keywords } },
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

  async findOneById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
    if (!user) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }
    return plainToClass(UserVo, user)
  }

  async update(id: number, updateUserDto: UpdateUserDto, updatedBy?: number) {
    return plainToClass(
      UserVo,
      await this.prismaService.user.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...updateUserDto,
          updatedBy
        }
      })
    )
  }

  async patch(id: number, patchUserDto: PatchUserDto, updatedBy?: number) {
    return plainToClass(
      UserVo,
      await this.prismaService.user.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...patchUserDto,
          updatedBy
        }
      })
    )
  }

  async remove(id: number, deletedBy?: number) {
    const associations = [
      'auth',
      'userRole',
      'userPosition',
      'userSetting',
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
          deletedBy
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
        deletedBy
      },
      include: {
        auths: true,
        userRoles: true,
        userPositions: true,
        userSettings: true,
        userTraffics: true,
        loginLogs: true,
        operationLogs: true
      }
    })
    await Promise.all(deletePromises)
    await this.prismaService.$transaction([user])
  }
}
