import { Injectable, NotFoundException } from '@nestjs/common'
import type { DictionaryTrans, Prisma } from '@prisma/client'
import { plainToClass } from 'class-transformer'
import _ from 'lodash'
import { I18nService } from 'nestjs-i18n'

import { LanguageCode } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'
import { PrismaService } from '@/shared/prisma/prisma.service'
import { I18nUtils, PrismaUtils } from '@/utils'

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

  // 唯一约束字段 - 字典编码
  private readonly UNIQUE_FIELDS_CODE = 'code'

  // 创建字典
  async create(createDictionaryDto: CreateDictionaryDto, userId: number): Promise<DictionaryVo> {
    try {
      const { label, remark, ...rest } = createDictionaryDto
      const dictionary = await this.prismaService.dictionary.create({
        data: {
          ...rest,
          createdBy: userId,
          dictionaryTrans: {
            createMany: {
              data: [
                ...I18nUtils.createTrans<Prisma.DictionaryTransCreateManyInput>(
                  { label, remark },
                  userId
                )
              ]
            }
          }
        }
      })
      return plainToClass(DictionaryVo, { ...dictionary, label, remark })
    } catch (e) {
      PrismaUtils.handleConflictException(e, [
        { key: this.UNIQUE_FIELDS_CODE, msg: this.i18nService.t('dictionary.CODE.CONFLICT') }
      ])
      throw e
    }
  }

  // 字典列表
  async findMany(pageDictionaryDto: PageDictionaryDto): Promise<PageDictionaryVo> {
    const { page, pageSize, searchText, startTime, endTime, orderBy, code, enabled, builtIn, id } =
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
          ...I18nUtils.generateTransByKeys<DictionaryTrans>(dictionaryTrans, ['label', 'remark'])
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
      where: { id, deletedAt: null },
      include: { dictionaryTrans: true }
    })
    if (!dictionary) {
      throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
    }
    const { dictionaryTrans, ...rest } = dictionary
    return plainToClass(DictionaryVo, {
      ...rest,
      ...I18nUtils.generateTransByKeys<DictionaryTrans>(dictionaryTrans, ['label', 'remark'])
    })
  }

  // 根据 Code 查询字典
  async findOneByCode(code: string): Promise<DictionaryVo> {
    const dictionary = await this.prismaService.dictionary.findUnique({
      where: { code, deletedAt: null },
      include: {
        dictionaryTrans: {
          where: { deletedAt: null }
        }
      }
    })
    if (!dictionary) {
      throw new NotFoundException(this.i18nService.t('common.RESOURCE.NOT.FOUND'))
    }
    const { dictionaryTrans, ...rest } = dictionary
    return plainToClass(DictionaryVo, {
      ...rest,
      ...I18nUtils.generateTransByKeys<DictionaryTrans>(dictionaryTrans, ['label', 'remark'])
    })
  }

  // 更新字典
  async update(
    id: number,
    updateDictionaryDto: UpdateDictionaryDto,
    userId: number
  ): Promise<DictionaryVo> {
    const { label, remark, ...rest } = updateDictionaryDto
    try {
      const dictionary = await this.prismaService.dictionary.update({
        where: { id, deletedAt: null },
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
      return plainToClass(DictionaryVo, { ...dictionary, label, remark })
    } catch (e) {
      PrismaUtils.handleNotFoundException(e, this.i18nService.t('common.RESOURCE.NOT.FOUND'))
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
      PrismaUtils.handleNotFoundException(e, this.i18nService.t('common.RESOURCE.NOT.FOUND'))
      throw e
    }
  }

  // 删除字典
  async remove(id: number, userId: number): Promise<void> {
    try {
      const deleteDictionary = this.prismaService.dictionary.update({
        where: {
          id,
          deletedAt: null
        },
        data: {
          deletedAt: new Date().toISOString(),
          deletedBy: userId,
          dictionaryTrans: {
            updateMany: {
              where: {
                deletedAt: null
              },
              data: {
                deletedAt: new Date().toISOString(),
                deletedBy: userId
              }
            }
          }
        },
        include: {
          dictionaryTrans: true,
          dictionaryItems: true
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

      ;(await deleteDictionary.dictionaryItems()).forEach(async (item) => {
        await this.prismaService.dictionaryItem.update({
          where: {
            id: item.id,
            deletedAt: null
          },
          data: {
            deletedAt: new Date().toISOString(),
            deletedBy: userId,
            dictionaryItemTrans: {
              updateMany: {
                where: {
                  deletedAt: null
                },
                data: {
                  deletedAt: new Date().toISOString(),
                  deletedBy: userId
                }
              }
            }
          }
        })
      })

      await this.prismaService.$transaction([deleteDictionaryItem, deleteDictionary])
    } catch (e) {
      PrismaUtils.handleBadRequestException(e, this.i18nService.t('common.DELETE.FAILED'))
      PrismaUtils.handleNotFoundException(e, this.i18nService.t('common.RESOURCE.NOT.FOUND'))
      throw e
    }
  }
}
