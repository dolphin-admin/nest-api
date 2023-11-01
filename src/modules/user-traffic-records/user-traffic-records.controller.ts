import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post
} from '@nestjs/common'

import { CreateUserTrafficRecordDto } from './dto/create-user-traffic-record.dto'
import { UpdateUserTrafficRecordDto } from './dto/update-user-traffic-record.dto'
import { UserTrafficRecordsService } from './user-traffic-records.service'

@Controller('user-traffic-records')
export class UserTrafficRecordsController {
  constructor(
    private readonly userTrafficRecordsService: UserTrafficRecordsService
  ) {}

  @Post()
  create(@Body() createUserTrafficRecordDto: CreateUserTrafficRecordDto) {
    return this.userTrafficRecordsService.create(createUserTrafficRecordDto)
  }

  @Get()
  findAll() {
    return this.userTrafficRecordsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTrafficRecordsService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserTrafficRecordDto: UpdateUserTrafficRecordDto
  ) {
    return this.userTrafficRecordsService.update(
      +id,
      updateUserTrafficRecordDto
    )
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTrafficRecordsService.remove(+id)
  }
}
