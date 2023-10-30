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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { plainToClass } from 'class-transformer'

import {
  ApiPageQuery,
  BaseResponseVo,
  JWTPayload,
  PageDateDto,
  PageResponseVo,
  User
} from '@/common'
import { ApiPageResponse } from '@/common/decorators/swagger/api-page-response.decorator'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'
import { UserVo } from './vo'

@ApiTags('用户')
@ApiBearerAuth('bearer')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '创建用户' })
  @ApiCreatedResponse({ description: '创建成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiBadRequestResponse({ description: '参数错误' })
  @ApiConflictResponse({ description: '用户已存在' })
  @ApiBody({ description: '用户信息', type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @ApiOperation({ summary: '用户列表' })
  @ApiPageResponse(UserVo)
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiPageQuery('searchText', 'date')
  @Get()
  async findMany(@Query() pageDto: PageDateDto) {
    const { page, pageSize } = pageDto
    const [data, total] = await this.usersService.findMany(pageDto)
    return new PageResponseVo<UserVo[]>({ page, pageSize, total, data })
  }

  @ApiOperation({ summary: '个人信息' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiNotFoundResponse({ description: '用户不存在' })
  @Get('me')
  async findCurrent(@User() user: JWTPayload) {
    if (!user) {
      throw new UnauthorizedException('认证失败')
    }
    const currentUser = await this.usersService.findOneById(user.sub)
    if (!currentUser) {
      throw new NotFoundException('用户不存在')
    }
    return new BaseResponseVo<UserVo>({
      data: plainToClass(UserVo, currentUser)
    })
  }

  @ApiOperation({ summary: '用户详情' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiNotFoundResponse({ description: '用户不存在' })
  @ApiParam({ name: 'id', description: '用户 ID', required: true, example: 1 })
  @Get(':id(\\d+)')
  async findOne(@Param('id') id: number) {
    const user = await this.usersService.findOneById(id)
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    return new BaseResponseVo<UserVo>({
      data: plainToClass(UserVo, user)
    })
  }

  @ApiOperation({ summary: '修改用户' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiBadRequestResponse({ description: '参数错误' })
  @ApiNotFoundResponse({ description: '用户不存在' })
  @ApiParam({ name: 'id', description: '用户 ID', required: true })
  @ApiBody({ description: '用户信息', type: UpdateUserDto })
  @Patch(':id(\\d+)')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiOkResponse({ description: '删除成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiBadRequestResponse({ description: '参数错误' })
  @ApiNotFoundResponse({ description: '用户不存在' })
  @ApiParam({ name: 'id', description: '用户 ID', required: true })
  @Delete(':id(\\d+)')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id)
  }
}
