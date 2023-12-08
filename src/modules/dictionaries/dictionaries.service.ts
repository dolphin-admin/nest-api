import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import type { DictionaryTrans } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nService } from 'nestjs-i18n'

import type { SortColumnKey } from '@/enums'
import { LanguageCode } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { I18nUtils } from '@/utils'

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

  async create(dictionaryDto: CreateDictionaryDto, userId: number): Promise<DictionaryVo> {
    try {
      const { label, remark, ...rest } = dictionaryDto
      const dictionary = await this.prismaService.dictionary.create({
        data: {
          ...rest,
          createdBy: userId,
          dictionaryTrans: {
            createMany: {
              data: [
                ...Object.values(LanguageCode).map((lang) => ({
                  label: label[lang],
                  remark: remark[lang],
                  lang,
                  createdBy: userId
                }))
              ]
            }
          }
        }
      })
      return plainToClass(DictionaryVo, { ...dictionary, label, remark })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code, meta } = e
        if (code === 'P2002') {
          if ((meta?.target as string[]).includes('code')) {
            throw new ConflictException(this.i18nService.t('common.RESOURCE.CONFLICT'))
          }
        }
      }
      throw e
    }
  }

  async findMany(pageDictionaryDto: PageDictionaryDto): Promise<PageDictionaryVo> {
    const {
      page,
      pageSize,
      searchText,
      startTime,
      endTime,
      sortColumnKeys,
      sortOrders,
      code,
      enabled,
      builtIn,
      id
    } = pageDictionaryDto

    const orderBy = sortColumnKeys.map((field: SortColumnKey, index) => ({
      [field]: sortOrders[index]
    }))

    const where: Prisma.DictionaryWhereInput = {
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
      OR: searchText
        ? [
            { code: { contains: searchText } },
            { id: { equals: _.toNumber(searchText) < 100000 ? _.toNumber(searchText) : 0 } }
          ]
        : undefined
    }

    const results = await this.prismaService.dictionary.findMany({
      where,
      include: {
        dictionaryTrans: {
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

    const total = await this.prismaService.dictionary.count({ where })

    return plainToClass(PageDictionaryVo, {
      records: results.map((dictionary) => {
        const { dictionaryTrans, ...rest } = dictionary
        return {
          ...rest,
          label: I18nUtils.generateTrans<DictionaryTrans>(dictionaryTrans, 'label'),
          remark: I18nUtils.generateTrans<DictionaryTrans>(dictionaryTrans, 'remark')
        }
      }),
      total,
      page,
      pageSize
    })
  }

  // 根据 ID 查询字典
  async findOneById(id: number): Promise<DictionaryVo> {
    const dictionary = await this.prismaService.dictionary.findUnique({
      where: { id },
      include: { dictionaryTrans: true }
    })
    if (!dictionary) {
      throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
    }
    // 删除 dictionaryTrans 字段
    const { dictionaryTrans, ...rest } = dictionary

    return plainToClass(DictionaryVo, {
      ...rest,
      label: I18nUtils.generateTrans<DictionaryTrans>(dictionaryTrans, 'label'),
      remark: I18nUtils.generateTrans<DictionaryTrans>(dictionaryTrans, 'remark')
    })
  }

  // 根据 Code 查询字典
  async findOneByCode(code: string): Promise<DictionaryVo> {
    const dictionary = await this.prismaService.dictionary.findUnique({
      where: { code },
      include: { dictionaryTrans: true }
    })
    if (!dictionary) {
      throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
    }
    // 删除 dictionaryTrans 字段
    const { dictionaryTrans, ...rest } = dictionary

    return plainToClass(DictionaryVo, {
      ...rest,
      label: I18nUtils.generateTrans<DictionaryTrans>(dictionaryTrans, 'label'),
      remark: I18nUtils.generateTrans<DictionaryTrans>(dictionaryTrans, 'remark')
    })
  }

  async remove(id: number, userId: number): Promise<void> {
    try {
      // 删除多语言翻译
      const deleteDictionaryTrans = this.prismaService.dictionaryTrans.updateMany({
        where: {
          dictionaryId: id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date().toISOString(),
          deletedBy: userId
        }
      })
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
        }
      })

      await this.prismaService.$transaction([
        deleteDictionaryTrans,
        deleteDictionaryItem,
        deleteDictionary
      ])
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2003') {
          throw new BadRequestException(this.i18nService.t('common.DELETE.FAILED'))
        }
        if (code === 'P2025') {
          throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
        }
      }
      throw e
    }
  }

  async update(
    id: number,
    updateDictionaryDto: UpdateDictionaryDto,
    userId: number
  ): Promise<DictionaryVo> {
    const { label, remark, ...rest } = updateDictionaryDto
    try {
      const dictionary = await this.prismaService.dictionary.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...rest,
          updatedBy: userId,
          dictionaryTrans: {
            updateMany: [
              ...Object.values(LanguageCode).map((lang) => ({
                where: {
                  dictionaryId: id,
                  lang: LanguageCode[lang],
                  deletedAt: null
                },
                data: {
                  label: label[lang],
                  remark: remark[lang],
                  updatedBy: userId
                }
              }))
            ]
          }
        }
      })
      return plainToClass(DictionaryVo, {
        ...dictionary,
        label,
        remark
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2025') {
          throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
        }
      }
      throw e
    }
  }

  async patch(id: number, patchDictionaryDto: PatchDictionaryDto, userId: number): Promise<void> {
    const { label, remark, ...rest } = patchDictionaryDto
    try {
      await this.prismaService.dictionary.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          ...rest,
          updatedBy: userId,
          dictionaryTrans: {
            updateMany: [
              ...Object.values(LanguageCode)
                .filter((lang) => label?.[lang] || remark?.[lang])
                .map((lang) => ({
                  where: {
                    dictionaryId: id,
                    lang,
                    deletedAt: null
                  },
                  data: {
                    ...(label?.[lang] && { label: label[lang] }),
                    ...(remark?.[lang] && { remark: remark[lang] }),
                    updatedBy: userId
                  }
                }))
            ]
          }
        }
      })
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        const { code } = e
        if (code === 'P2025') {
          throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
        }
      }
      throw e
    }
  }
}
