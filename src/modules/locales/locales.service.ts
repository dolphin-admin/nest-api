import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { plainToClass } from 'class-transformer'
import type { FilterQuery, SortOrder } from 'mongoose'
import { Model } from 'mongoose'
import { I18nContext, I18nService } from 'nestjs-i18n'

import { LanguageCode, type SortColumnKey } from '@/enums'
import type { I18nTranslations } from '@/generated/i18n.generated'

import type { CreateLocaleDto, PageLocaleDto, UpdateLocaleDto } from './dto'
import { Locale } from './schemas'
import { LocaleVo, PageLocaleVo } from './vo'

@Injectable()
export class LocalesService {
  constructor(
    @InjectModel(Locale.name) private readonly LocaleModel: Model<Locale>,
    private readonly i18nService: I18nService<I18nTranslations>
  ) {}

  async create(createLocaleDto: CreateLocaleDto): Promise<LocaleVo> {
    const locale = await new this.LocaleModel(createLocaleDto).save()
    return plainToClass(LocaleVo, locale)
  }

  async findAll(pageLocaleDto: PageLocaleDto): Promise<PageLocaleVo> {
    const { page, pageSize, keywords, startTime, endTime, sortColumnKeys, sortOrders, key, ns } =
      pageLocaleDto

    const query: FilterQuery<Locale> = {
      ...(keywords && {
        $or: [
          { key: { $regex: keywords, $options: 'i' } },
          { ns: { $regex: keywords, $options: 'i' } },
          ...Object.values(LanguageCode).map((lang) => ({
            [lang]: { $regex: keywords, $options: 'i' }
          }))
        ]
      }),
      ...(key && { key: { $regex: key, $options: 'i' } }),
      ...(ns && { ns: { $regex: ns, $options: 'i' } }),
      ...(startTime && { createdAt: { $gte: startTime } }),
      ...(endTime && { createdAt: { $lte: endTime } })
    }

    const sort: [string, SortOrder][] = sortColumnKeys.map((field: SortColumnKey, index) => [
      field,
      sortOrders[index]
    ])

    return plainToClass(PageLocaleVo, {
      records: await this.LocaleModel.find(query)
        .sort(sort)
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      total: await this.LocaleModel.countDocuments(query),
      page,
      pageSize
    })
  }

  async findOneById(id: string): Promise<LocaleVo> {
    const locale = await this.LocaleModel.findById(id).exec()
    if (!locale) {
      throw new NotFoundException(
        this.i18nService.t('common.RESOURCE.NOT.FOUND', { lang: I18nContext.current()!.lang })
      )
    }
    return plainToClass(LocaleVo, locale)
  }

  async update(id: string, updateLocaleDto: UpdateLocaleDto): Promise<LocaleVo> {
    await this.findOneById(id)
    const locale = await this.LocaleModel.findByIdAndUpdate(id, updateLocaleDto).exec()
    return plainToClass(LocaleVo, locale)
  }

  async remove(id: string): Promise<void> {
    await this.findOneById(id)
    await this.LocaleModel.findByIdAndDelete(id).exec()
  }
}
