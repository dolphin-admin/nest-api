import { Injectable, NotFoundException } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { CacheKeyService } from '@/shared/redis/cache-key.service'
import { RedisService } from '@/shared/redis/redis.service'

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
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly redisService: RedisService,
    private readonly cacheKeyService: CacheKeyService
  ) {}

  async create(createSettingDto: CreateSettingDto, createdBy: number) {
    const setting = await this.prismaService.setting.create({
      data: {
        ...createSettingDto,
        createdBy
      }
    })

    const settingVo = plainToClass(SettingVo, setting)

    await this.setSettingCache(settingVo)

    return settingVo
  }

  async findMany(pageSettingDto: PageSettingDto) {
    const { page, pageSize, keywords, startTime, endTime, orderBy, key, value, enabled, id } =
      pageSettingDto

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
          }
        }
      ],
      OR: keywords
        ? [
            { id: { equals: _.toNumber(keywords) < 100000 ? _.toNumber(keywords) : 0 } },
            { key: { contains: keywords } },
            { value: { contains: keywords } },
            { label: { contains: keywords } },
            { remark: { contains: keywords } }
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

  async findOneById(id: number) {
    const cachedResult = await this.getSettingCache(id)
    if (cachedResult) {
      return cachedResult
    }

    const setting = await this.prismaService.setting.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
    if (!setting) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }

    const settingVo = plainToClass(SettingVo, setting)

    await this.setSettingCache(settingVo)

    return settingVo
  }

  async findOneByKey(key: string) {
    const cachedResult = await this.getSettingCache(key)
    if (cachedResult) {
      return cachedResult
    }

    const setting = await this.prismaService.setting.findUnique({
      where: {
        key,
        deletedAt: null
      }
    })
    if (!setting) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }

    const settingVo = plainToClass(SettingVo, setting)

    await this.setSettingCache(settingVo)

    return settingVo
  }

  async update(
    id: number,
    updateOrPatchSettingDto: UpdateSettingDto | PatchSettingDto,
    updatedBy: number
  ) {
    const settingVo = plainToClass(
      SettingVo,
      await this.prismaService.setting.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...updateOrPatchSettingDto,
          updatedBy
        }
      })
    )

    await this.setSettingCache(settingVo)

    return settingVo
  }

  async remove(id: number, deletedBy: number): Promise<void> {
    await this.prismaService.setting.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date().toISOString(),
        deletedBy
      }
    })
  }

  async getSettingCache(idOrKey: number | string) {
    const cacheKey = this.cacheKeyService.getSettingCacheKey(idOrKey)
    return (await this.redisService.jsonGet<SettingVo>(cacheKey)) ?? null
  }

  async setSettingCache(settingVo: SettingVo) {
    const cacheKeys = [
      this.cacheKeyService.getSettingCacheKey(settingVo.id),
      this.cacheKeyService.getSettingCacheKey(settingVo.key)
    ]

    await Promise.all(
      cacheKeys.map((k) =>
        this.redisService.jsonSet(k, settingVo, this.redisService.DATA_DEFAULT_TTL)
      )
    )
  }
}
