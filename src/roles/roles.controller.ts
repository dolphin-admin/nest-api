import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'

import { ApiPageQuery } from '@/common'

import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RolesService } from './roles.service'

@ApiTags('角色')
@ApiBearerAuth('bearer')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: '创建角色' })
  @ApiCreatedResponse({ description: '创建成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiBadRequestResponse({ description: '参数错误' })
  @ApiConflictResponse({ description: '角色已存在' })
  @ApiBody({ description: '用户信息', type: CreateRoleDto })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @ApiOperation({ summary: '角色列表' })
  @ApiOkResponse({ description: '请求成功' })
  @ApiUnauthorizedResponse({ description: '认证失败' })
  @ApiPageQuery('searchText', 'date')
  @Get()
  findAll() {
    return this.rolesService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id)
  }
}
