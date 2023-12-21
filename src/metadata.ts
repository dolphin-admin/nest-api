/* eslint-disable */
export default async () => {
    const t = {
        ["./enums/sort-column-key.enum"]: await import("./enums/sort-column-key.enum"),
        ["./enums/sort-order.enum"]: await import("./enums/sort-order.enum"),
        ["./modules/users/vo/user.vo"]: await import("./modules/users/vo/user.vo"),
        ["./modules/dictionaries/vo/dictionary-select-item.vo"]: await import("./modules/dictionaries/vo/dictionary-select-item.vo"),
        ["./modules/dictionaries/vo/dictionary.vo"]: await import("./modules/dictionaries/vo/dictionary.vo"),
        ["./modules/dictionary-items/vo/dictionary-item.vo"]: await import("./modules/dictionary-items/vo/dictionary-item.vo"),
        ["./modules/locales/vo/locale.vo"]: await import("./modules/locales/vo/locale.vo"),
        ["./modules/settings/vo/setting.vo"]: await import("./modules/settings/vo/setting.vo"),
        ["./modules/files/vo/file.vo"]: await import("./modules/files/vo/file.vo")
    };
    return { "@nestjs/swagger": { "models": [[import("./class/page.dto"), { "PageDto": { page: { required: true, type: () => Number, default: 1, minimum: 1 }, pageSize: { required: true, type: () => Number, default: 10, minimum: 1 }, keywords: { required: false, type: () => String }, startTime: { required: false, type: () => String }, endTime: { required: false, type: () => String }, sortColumnKeys: { required: true, enum: t["./enums/sort-column-key.enum"].SortColumnKey, isArray: true }, sortOrders: { required: true, enum: t["./enums/sort-order.enum"].SortOrder, isArray: true }, orderBy: { required: false, type: () => [Object], description: "Prisma \u6392\u5E8F\u5BF9\u8C61\u6570\u7EC4" }, sort: { required: false, description: "MongoDB \u6392\u5E8F\u6570\u7EC4" } } }], [import("./modules/files/vo/file.vo"), { "FileVo": { path: { required: true, type: () => String }, fieldname: { required: true, type: () => String }, filename: { required: true, type: () => String }, originalname: { required: true, type: () => String }, mimetype: { required: true, type: () => String }, size: { required: true, type: () => Number } } }], [import("./modules/users/dto/create-user.dto"), { "CreateUserDto": { username: { required: true, type: () => String, minLength: 4, maxLength: 16 }, password: { required: true, type: () => String, minLength: 6, maxLength: 16, pattern: "/[0-9]/" } } }], [import("./modules/users/dto/page-user.dto"), { "PageUserDto": { id: { required: false, type: () => Number }, enabled: { required: false, type: () => Boolean } } }], [import("./modules/users/dto/update-user.dto"), { "UpdateUserDto": { username: { required: true, type: () => String, minLength: 4, maxLength: 16 }, nickName: { required: false, type: () => String, maxLength: 16 }, email: { required: false, type: () => String, maxLength: 50 }, phoneNumber: { required: false, type: () => String, maxLength: 25 }, firstName: { required: false, type: () => String, maxLength: 10 }, middleName: { required: false, type: () => String, maxLength: 10 }, lastName: { required: false, type: () => String, maxLength: 10 }, avatarUrl: { required: false, type: () => String, maxLength: 100 }, gender: { required: false, type: () => String, maxLength: 10 }, country: { required: false, type: () => String, maxLength: 25 }, province: { required: false, type: () => String, maxLength: 25 }, city: { required: false, type: () => String, maxLength: 25 }, address: { required: false, type: () => String, maxLength: 100 }, biography: { required: false, type: () => String, maxLength: 500 }, website: { required: false, type: () => String, maxLength: 50 }, profile: { required: false, type: () => String, maxLength: 50 }, birthDate: { required: false, type: () => Date }, enabled: { required: false, type: () => Boolean } } }], [import("./modules/users/dto/patch-user.dto"), { "PatchUserDto": { username: { required: false, type: () => String }, password: { required: false, type: () => String, minLength: 6, maxLength: 16, pattern: "/[0-9]/" } } }], [import("./modules/users/vo/user.vo"), { "UserVo": { id: { required: true, type: () => Number }, username: { required: true, type: () => String }, nickName: { required: false, type: () => String }, email: { required: false, type: () => String }, phoneNumber: { required: false, type: () => String }, firstName: { required: false, type: () => String }, middleName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, avatarUrl: { required: false, type: () => String }, gender: { required: false, type: () => String }, country: { required: false, type: () => String }, province: { required: false, type: () => String }, city: { required: false, type: () => String }, address: { required: false, type: () => String }, biography: { required: false, type: () => String }, website: { required: false, type: () => String }, profile: { required: false, type: () => String }, birthDate: { required: false, type: () => Date }, enabled: { required: true, type: () => Boolean } } }], [import("./modules/users/vo/page-user.vo"), { "PageUserVo": { records: { required: true, type: () => [t["./modules/users/vo/user.vo"].UserVo] } } }], [import("./modules/auth/dto/login.dto"), { "LoginDto": { username: { required: true, type: () => String, minLength: 4, maxLength: 16 }, password: { required: true, type: () => String, minLength: 6, maxLength: 16 } } }], [import("./modules/auth/dto/signup.dto"), { "SignupDto": { username: { required: true, type: () => String, minLength: 4, maxLength: 16 }, password: { required: true, type: () => String, minLength: 6, maxLength: 16, pattern: "/[0-9]/" }, firstName: { required: true, type: () => String, maxLength: 10 }, lastName: { required: true, type: () => String, maxLength: 10 } } }], [import("./modules/auth/vo/token.vo"), { "TokenVo": { accessToken: { required: true, type: () => String }, refreshToken: { required: true, type: () => String } } }], [import("./modules/auth/vo/auth.vo"), { "AuthVo": { user: { required: true, type: () => t["./modules/users/vo/user.vo"].UserVo } } }], [import("./modules/dictionaries/dto/create-dictionary.dto"), { "CreateDictionaryDto": { code: { required: true, type: () => String, maxLength: 50 }, label: { required: true, type: () => String, maxLength: 50 }, remark: { required: false, type: () => String, maxLength: 500 }, enabled: { required: true, type: () => Boolean }, sort: { required: false, type: () => Number } } }], [import("./modules/dictionaries/dto/page-dictionary.dto"), { "PageDictionaryDto": { id: { required: false, type: () => Number }, code: { required: false, type: () => String }, enabled: { required: false, type: () => Boolean } } }], [import("./modules/dictionaries/dto/patch-dictionary.dto"), { "PatchDictionaryDto": { code: { required: true, type: () => String, maxLength: 50 }, label: { required: false, type: () => String, maxLength: 50 }, remark: { required: false, type: () => String, maxLength: 500 }, enabled: { required: false, type: () => Boolean }, sort: { required: false, type: () => Number } } }], [import("./modules/dictionaries/dto/update-dictionary.dto"), { "UpdateDictionaryDto": {} }], [import("./modules/dictionaries/vo/dictionary.vo"), { "DictionaryVo": { id: { required: true, type: () => Number }, code: { required: true, type: () => String }, label: { required: true, type: () => String }, remark: { required: false, type: () => String }, enabled: { required: true, type: () => Boolean }, sort: { required: false, type: () => Number } } }], [import("./modules/dictionaries/vo/dictionary-select-item.vo"), { "DictionarySelectItemVo": { id: { required: true, type: () => Number }, value: { required: true, type: () => String }, label: { required: true, type: () => String } } }], [import("./modules/dictionaries/vo/list-dictionary-select-item.vo"), { "ListDictionarySelectItemVo": { records: { required: true, type: () => [t["./modules/dictionaries/vo/dictionary-select-item.vo"].DictionarySelectItemVo] }, code: { required: true, type: () => String } } }], [import("./modules/dictionaries/vo/page-dictionary.vo"), { "PageDictionaryVo": { records: { required: true, type: () => [t["./modules/dictionaries/vo/dictionary.vo"].DictionaryVo] } } }], [import("./modules/dictionary-items/dto/create-dictionary-item.dto"), { "CreateDictionaryItemDto": { value: { required: true, type: () => String, maxLength: 250 }, label: { required: true, type: () => String, maxLength: 50 }, remark: { required: false, type: () => String, maxLength: 500 }, enabled: { required: true, type: () => Boolean }, sort: { required: false, type: () => Number }, dictionaryId: { required: true, type: () => Number } } }], [import("./modules/dictionary-items/dto/page-dictionary-item.dto"), { "PageDictionaryItemDto": { id: { required: false, type: () => Number }, dictionaryId: { required: false, type: () => Number }, label: { required: false, type: () => String }, enabled: { required: false, type: () => Boolean } } }], [import("./modules/dictionary-items/dto/patch-dictionary-item.dto"), { "PatchDictionaryItemDto": { value: { required: false, type: () => String, maxLength: 250 }, label: { required: false, type: () => String, maxLength: 50 }, remark: { required: false, type: () => String, maxLength: 500 }, enabled: { required: false, type: () => Boolean }, sort: { required: false, type: () => Number } } }], [import("./modules/dictionary-items/dto/update-dictionary-item.dto"), { "UpdateDictionaryItemDto": {} }], [import("./modules/dictionary-items/vo/dictionary-item.vo"), { "DictionaryItemVo": { id: { required: true, type: () => Number }, value: { required: true, type: () => String }, label: { required: true, type: () => String }, remark: { required: false, type: () => String }, enabled: { required: true, type: () => Boolean }, sort: { required: false, type: () => Number }, code: { required: true, type: () => String } } }], [import("./modules/dictionary-items/vo/page-dictionary-item.vo"), { "PageDictionaryItemVo": { records: { required: true, type: () => [t["./modules/dictionary-items/vo/dictionary-item.vo"].DictionaryItemVo] } } }], [import("./modules/locales/dto/create-locale.dto"), { "CreateLocaleDto": { key: { required: true, type: () => String }, ns: { required: true, type: () => String }, 'en-US': { required: false, type: () => String }, 'zh-CN': { required: false, type: () => String } } }], [import("./modules/locales/dto/page-locale.dto"), { "PageLocaleDto": { key: { required: false, type: () => String }, ns: { required: false, type: () => String } } }], [import("./modules/locales/dto/update-locale.dto"), { "UpdateLocaleDto": {} }], [import("./modules/locales/vo/locale.vo"), { "LocaleVo": { key: { required: true, type: () => String }, ns: { required: true, type: () => String }, 'en-US': { required: true, type: () => String }, 'zh-CN': { required: true, type: () => String } } }], [import("./modules/locales/vo/locale-resource.vo"), { "LocaleResourceVO": { ns: { required: true, type: () => String }, resources: { required: true, type: () => Object } } }], [import("./modules/locales/vo/page-locale.vo"), { "PageLocaleVo": { records: { required: true, type: () => [t["./modules/locales/vo/locale.vo"].LocaleVo] } } }], [import("./modules/settings/dto/create-setting.dto"), { "CreateSettingDto": { key: { required: true, type: () => String, maxLength: 50 }, value: { required: true, type: () => String, maxLength: 250 }, label: { required: true, type: () => String, maxLength: 50 }, remark: { required: false, type: () => String, maxLength: 500 }, enabled: { required: true, type: () => Boolean } } }], [import("./modules/settings/dto/page-setting.dto"), { "PageSettingDto": { id: { required: false, type: () => Number }, key: { required: false, type: () => String }, value: { required: false, type: () => String }, enabled: { required: false, type: () => Boolean } } }], [import("./modules/settings/dto/update-setting.dto"), { "UpdateSettingDto": {} }], [import("./modules/settings/dto/patch-setting.dto"), { "PatchSettingDto": { key: { required: false, type: () => String, maxLength: 50 }, value: { required: false, type: () => String, maxLength: 250 }, label: { required: false, type: () => String, maxLength: 50 }, remark: { required: false, type: () => String, maxLength: 500 }, enabled: { required: false, type: () => Boolean } } }], [import("./modules/settings/vo/setting.vo"), { "SettingVo": { id: { required: true, type: () => Number }, key: { required: true, type: () => String }, value: { required: true, type: () => String }, label: { required: true, type: () => String }, remark: { required: false, type: () => String }, enabled: { required: true, type: () => Boolean }, sort: { required: false, type: () => Number } } }], [import("./modules/settings/vo/page-setting.vo"), { "PageSettingVo": { records: { required: true, type: () => [t["./modules/settings/vo/setting.vo"].SettingVo] } } }]], "controllers": [[import("./shared/cos/cos.controller"), { "CosController": { "uploadToCos": { type: [t["./modules/files/vo/file.vo"].FileVo] } } }], [import("./modules/app.controller"), { "AppController": { "getApp": {}, "getVersion": {} } }], [import("./modules/users/users.controller"), { "UsersController": { "create": {}, "findMany": {}, "findCurrent": {}, "findOneById": {}, "update": {}, "patch": {}, "remove": {} } }], [import("./modules/auth/auth.controller"), { "AuthController": { "signup": {}, "login": {}, "refresh": {} } }], [import("./modules/dictionaries/dictionaries.controller"), { "DictionariesController": { "create": {}, "findMany": {}, "findOneById": {}, "findManyByCodes": {}, "findOneByCode": {}, "update": {}, "patch": {}, "remove": {} } }], [import("./modules/dictionary-items/dictionary-items.controller"), { "DictionaryItemsController": { "create": {}, "findMany": {}, "findOneById": {}, "update": {}, "patch": {}, "remove": {} } }], [import("./modules/files/files.controller"), { "FilesController": { "upload": { type: [t["./modules/files/vo/file.vo"].FileVo] }, "download": {}, "findOne": {} } }], [import("./modules/locales/locales.controller"), { "LocalesController": { "create": {}, "findAll": {}, "findManyByLang": {}, "findOneById": {}, "update": {}, "remove": {} } }], [import("./modules/settings/settings.controller"), { "SettingsController": { "create": {}, "findMany": {}, "findOneById": {}, "findOneByKey": {}, "update": {}, "patch": {}, "remove": {} } }]] } };
};