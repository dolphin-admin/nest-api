import { Injectable, NotFoundException } from '@nestjs/common'
import { hash } from '@node-rs/bcrypt'
import type { Prisma } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { CacheKeyService } from '@/shared/redis/cache-key.service'
import { RedisService } from '@/shared/redis/redis.service'

import type { PageUserDto, PatchUserDto } from './dto'
import type { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import { PageUserVo, UserVo } from './vo'

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly redisService: RedisService,
    private readonly cacheKeyService: CacheKeyService
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: number) {
    const hashedPassword = await hash(createUserDto.password)

    const user = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        createdBy
      }
    })

    const userVo = plainToClass(UserVo, user)

    await this.setUserCache(userVo)

    return userVo
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
    const cachedResult = await this.getUserCache(id)
    if (cachedResult) {
      return cachedResult
    }

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
    const userVo = plainToClass(UserVo, user)

    await this.setUserCache(userVo)

    return userVo
  }

  async update(id: number, updateUserDto: UpdateUserDto, updatedBy?: number) {
    const userVo = plainToClass(
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

    await this.setUserCache(userVo)

    return userVo
  }

  async patch(id: number, patchUserDto: PatchUserDto, updatedBy?: number) {
    const userVo = plainToClass(
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

    await this.setUserCache(userVo)

    return userVo
  }

  async remove(id: number, deletedBy?: number) {
    await this.prismaService.user.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date().toISOString(),
        deletedBy
      }
    })

    await this.redisService.del(this.cacheKeyService.getUserCacheKey(id))
  }

  async getUserCache(id: number) {
    const cacheKey = this.cacheKeyService.getUserCacheKey(id)
    const cachedResult = await this.redisService.hGetAll<UserVo>(cacheKey)
    if (cachedResult) {
      return cachedResult
    }
    return null
  }

  async setUserCache(userVo: UserVo) {
    const cacheKey = this.cacheKeyService.getUserCacheKey(userVo.id)
    await this.redisService.hSetObj(cacheKey, { ...userVo }, this.redisService.DATA_DEFAULT_TTL)
  }
}
