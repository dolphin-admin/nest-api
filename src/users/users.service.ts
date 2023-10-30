import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { plainToClass, plainToInstance } from 'class-transformer'

import type { PageDateDto } from '@/common'
import { BaseResponseVo } from '@/common'
import { PrismaService } from '@/prisma/prisma.service'

import type { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import { UserVo } from './vo'

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: createUserDto
      })
      const userVo = plainToClass(UserVo, user)
      return new BaseResponseVo<UserVo>({
        data: userVo
      })
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const { meta, code } = err
        if (code === 'P2002') {
          if ((meta?.target as string[]).includes('username')) {
            throw new ConflictException('用户名已存在')
          }
        }
      }
      throw err
    }
  }

  async findMany(pageDateDto: PageDateDto): Promise<[UserVo[], number]> {
    const { page, pageSize, searchText, startTime, endTime } = pageDateDto
    console.log(page, pageSize, searchText, startTime, endTime)
    const users = await this.prismaService.user.findMany()
    const total = await this.prismaService.user.count()
    const userVoList = plainToInstance(UserVo, users)
    return [userVoList, total]
  }

  findOneById(id: number) {
    return this.prismaService.user.findUnique({
      where: {
        id
      }
    })
  }

  findOneByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username
      }
    })
  }

  update(_id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
