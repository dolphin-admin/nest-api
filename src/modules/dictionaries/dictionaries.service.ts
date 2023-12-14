import { Injectable, NotFoundException } from '@nestjs/common'
import type { Dictionary, Prisma } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nContext, I18nService } from 'nestjs-i18n'

import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'

import type {
  CreateDictionaryDto,
  PageDictionaryDto,
  PatchDictionaryDto,
  UpdateDictionaryDto
} from './dto'
import { DictionaryVo, PageDictionaryVo } from './vo'

@Injectable()
export class DictionariesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  // 检查字典是否存在
  private checkExists(dictionary: Dictionary | null) {
    if (!dictionary) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }
  }

  // 创建字典
  async create(createDictionaryDto: CreateDictionaryDto, userId: number): Promise<DictionaryVo> {
    return plainToClass(
      DictionaryVo,
      await this.prismaService.dictionary.create({
        data: {
          ...createDictionaryDto,
          createdBy: userId
        }
      })
    )
  }

  // 字典列表
  async findMany(pageDictionaryDto: PageDictionaryDto) {
    const { page, pageSize, keywords, startTime, endTime, orderBy, code, enabled, builtIn, id } =
      pageDictionaryDto

    const where: Prisma.DictionaryWhereInput = {
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
          code: {
            ...(code && { contains: code })
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
            { code: { contains: keywords } },
            { id: { equals: _.toNumber(keywords) < 100000 ? _.toNumber(keywords) : 0 } }
          ]
        : undefined
    }

    const records = await this.prismaService.dictionary.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize
    })
    const total = await this.prismaService.dictionary.count({ where })
    return plainToClass(PageDictionaryVo, { records, total, page, pageSize })
  }

  // 根据 ID 查询字典
  async findOneById(id: number) {
    const dictionary = await this.prismaService.dictionary.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })
    this.checkExists(dictionary)
    return plainToClass(DictionaryVo, dictionary)
  }

  // 根据 Code 查询字典
  async findOneByCode(code: string) {
    const dictionary = await this.prismaService.dictionary.findUnique({
      where: {
        code,
        deletedAt: null
      }
    })
    this.checkExists(dictionary)
    return plainToClass(DictionaryVo, dictionary)
  }

  // 更新字典
  async update(id: number, updateDictionaryDto: UpdateDictionaryDto, userId: number) {
    return plainToClass(
      DictionaryVo,
      await this.prismaService.dictionary.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...updateDictionaryDto,
          updatedBy: userId
        }
      })
    )
  }

  async patch(id: number, patchDictionaryDto: PatchDictionaryDto, userId: number) {
    return plainToClass(
      DictionaryVo,
      await this.prismaService.dictionary.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...patchDictionaryDto,
          updatedBy: userId
        }
      })
    )
  }

  // 删除字典
  async remove(id: number, userId: number) {
    const deleteDictionaryItem = this.prismaService.dictionaryItem.updateMany({
      where: {
        dictionaryId: id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date().toISOString(),
        deletedBy: userId
      }
    })
    const deleteDictionary = this.prismaService.dictionary.update({
      where: {
        id,
        deletedAt: null
      },
      data: {
        deletedAt: new Date().toISOString(),
        deletedBy: userId
      },
      include: {
        dictionaryItems: true
      }
    })
    await this.prismaService.$transaction([deleteDictionaryItem, deleteDictionary])
  }
}
