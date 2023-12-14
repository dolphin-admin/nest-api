import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { I18n, I18nContext } from 'nestjs-i18n'

import { BaseResponseVo, PageDto } from '@/class'
import { User } from '@/decorators'
import type { I18nTranslations } from '@/generated/i18n.generated'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@ApiTags('用户')
@ApiBearerAuth('bearer')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '创建用户' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return new BaseResponseVo({ data: await this.usersService.create(createUserDto) })
  }

  @ApiOperation({ summary: '用户列表' })
  @Get()
  async findMany(@Query() pageDto: PageDto) {
    const { page, pageSize } = pageDto
    const [records, total] = await this.usersService.findMany(pageDto)
    return new BaseResponseVo({ data: { page, pageSize, total, records } })
  }

  @ApiOperation({ summary: '个人信息' })
  @Get('me')
  async findCurrent(@User('sub') id: number, @I18n() i18n: I18nContext<I18nTranslations>) {
    const currentUser = await this.usersService.findOneById(id)
    if (!currentUser) {
      throw new UnauthorizedException(i18n.t('auth.UNAUTHORIZED'))
    }
    return new BaseResponseVo({ data: currentUser })
  }

  @ApiOperation({ summary: '用户详情' })
  @Get(':id(\\d+)')
  async findOneById(@Param('id') id: number) {
    const user = await this.usersService.findOneById(id)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    return new BaseResponseVo({ data: user })
  }

  @ApiOperation({ summary: '修改用户' })
  @Patch(':id(\\d+)')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @ApiOperation({ summary: '删除用户' })
  @Delete(':id(\\d+)')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id)
  }
}
