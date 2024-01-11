import { Injectable, NotFoundException } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'

import type {
  CreateDictionaryItemDto,
  PageDictionaryItemDto,
  PatchDictionaryItemDto,
  UpdateDictionaryItemDto
} from './dto'
import { DictionaryItemVo, PageDictionaryItemVo } from './vo'

@Injectable()
export class DictionaryItemsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  async create(createDictionaryItemDto: CreateDictionaryItemDto, createdBy: number) {
    return plainToClass(
      DictionaryItemVo,
      await this.prismaService.dictionaryItem.create({
        data: {
          ...createDictionaryItemDto,
          createdBy
        }
      })
    )
  }

  async findMany(pageDictionaryItemDto: PageDictionaryItemDto) {
    const {
      page,
      pageSize,
      keywords,
      startTime,
      endTime,
      orderBy,
      dictionaryId,
      label,
      enabled,
      id
    } = pageDictionaryItemDto

    const where: Prisma.DictionaryItemWhereInput = {
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
          },
          dictionaryId: {
            ...(dictionaryId && { equals: dictionaryId })
          },
          label: {
            ...(label && { contains: label })
          }
        }
      ],
      OR: keywords
        ? [
            { id: { equals: _.toNumber(keywords) < 100000 ? _.toNumber(keywords) : 0 } },
            { label: { contains: keywords } },
            { remark: { contains: keywords } }
          ]
        : undefined
    }

    const records = await this.prismaService.dictionaryItem.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    const total = await this.prismaService.dictionaryItem.count({ where })

    return plainToClass(PageDictionaryItemVo, { records, total, page, pageSize })
  }

  async findOneById(id: number) {
    const dictionaryItem = await this.prismaService.dictionaryItem.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })

    if (!dictionaryItem) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }

    return plainToClass(DictionaryItemVo, dictionaryItem)
  }

  async update(
    id: number,
    updateOrPatchDictionaryItemDto: UpdateDictionaryItemDto | PatchDictionaryItemDto,
    updatedBy: number
  ) {
    return plainToClass(
      DictionaryItemVo,
      await this.prismaService.dictionaryItem.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...updateOrPatchDictionaryItemDto,
          updatedBy
        }
      })
    )
  }

  async remove(id: number, deletedBy: number) {
    await this.prismaService.dictionaryItem.update({
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
}
