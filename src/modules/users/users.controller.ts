import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { BaseResponseVo } from '@/class'
import { ApiOkResponse, ApiPageOKResponse, ApiPageQuery, User } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { CreateUserDto, PageUserDto, PatchUserDto, UpdatePasswordDto, UpdateUserDto } from './dto'
import { UsersService } from './users.service'
import { UserVo } from './vo'

@ApiTags('用户')
@ApiBearerAuth('bearer')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '创建用户' })
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new BaseResponseVo({
      data: await this.usersService.create(createUserDto, userId),
      msg: i18n.t('common.CREATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '用户列表' })
  @ApiPageOKResponse(UserVo)
  @ApiPageQuery('keywords', 'date')
  @Get()
  async findMany(@Query() pageUserDto: PageUserDto) {
    return new BaseResponseVo({ data: await this.usersService.findMany(pageUserDto) })
  }

  @ApiOperation({ summary: '个人信息' })
  @Get('me')
  async findCurrent(@User('sub') id: number) {
    return new BaseResponseVo({ data: await this.usersService.findOneById(id) })
  }

  @ApiOperation({ summary: '修改密码' })
  @Post('/:id(\\d+)/change-password')
  async updatePassword(
    @Param('id') id: number,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new BaseResponseVo({
      data: await this.usersService.updatePassword(id, updatePasswordDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '用户详情 [id]' })
  @ApiOkResponse(UserVo)
  @Get(':id(\\d+)')
  async findOneById(@Param('id') id: number) {
    return new BaseResponseVo({ data: await this.usersService.findOneById(id) })
  }

  @ApiOperation({ summary: '更新用户' })
  @ApiOkResponse(UserVo)
  @Put(':id(\\d+)')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new BaseResponseVo({
      data: await this.usersService.update(id, updateUserDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '修改用户' })
  @ApiOkResponse(UserVo)
  @Patch(':id(\\d+)')
  async patch(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patchUserDto: PatchUserDto,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    return new BaseResponseVo({
      data: await this.usersService.patch(id, patchUserDto, userId),
      msg: i18n.t('common.OPERATE.SUCCESS')
    })
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiOkResponse()
  @Delete(':id(\\d+)')
  async remove(
    @Param('id', new ParseIntPipe()) id: number,
    @User('sub') userId: number,
    @I18n() i18n: I18nContext<I18nTranslations>
  ) {
    await this.usersService.remove(id, userId)
    return new BaseResponseVo({
      msg: i18n.t('common.DELETE.SUCCESS')
    })
  }
}
