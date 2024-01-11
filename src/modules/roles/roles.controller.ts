import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

import { R } from '@/class'

import { RolesService } from './roles.service'

@ApiTags('角色')
@ApiBearerAuth('bearer')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiOperation({ summary: '创建角色' })
  @Post()
  async create() {
    return new R({})
  }

  @ApiOperation({ summary: '角色列表' })
  @Get()
  async findMany() {
    return new R({})
  }

  @ApiOperation({ summary: '更新角色' })
  @Put()
  async update() {
    return new R({})
  }

  @ApiOperation({ summary: '部分更新' })
  @Patch()
  async patch() {
    return new R({})
  }

  @ApiOperation({ summary: '删除角色' })
  @Delete()
  async remove() {
    return new R({})
  }
}
