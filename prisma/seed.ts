import { hash } from '@node-rs/bcrypt'
import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_ADMIN_USERNAME = 'admin'
const SEED_ADMIN_PASSWORD = '123456'
const SEED_VISITOR_USERNAME = 'visitor'
const SEED_VISITOR_PASSWORD = '123456'

async function main() {
  // 创建超级管理员
  const commonUserInfo = {
    nickName: 'Bruce',
    firstName: 'Bruce',
    lastName: 'Song',
    avatarUrl: 'https://avatars.githubusercontent.com/u/62941121?v=4',
    country: 'China',
    province: 'Jiangsu',
    city: 'Suzhou',
    biography: 'The author of Dolphin Admin',
    enabled: true,
    builtIn: true
  }

  const defaultAdminUser: Prisma.UserCreateInput = {
    ...commonUserInfo,
    username: SEED_ADMIN_USERNAME,
    password: await hash(SEED_ADMIN_PASSWORD, 10),
    email: 'recall4056@gmail.com'
  }

  const defaultVisitorUser: Prisma.UserCreateInput = {
    ...commonUserInfo,
    username: SEED_VISITOR_USERNAME,
    password: await hash(SEED_VISITOR_PASSWORD, 10)
  }

  const adminUser = await prisma.user.findUnique({ where: { username: SEED_ADMIN_USERNAME } })
  const visitorUser = await prisma.user.findUnique({ where: { username: SEED_VISITOR_USERNAME } })

  if (adminUser) {
    console.log('超级管理员已存在，无需重复创建')
  } else {
    await prisma.user.create({
      data: {
        ...defaultAdminUser
      }
    })
  }

  if (visitorUser) {
    console.log('访客用户已存在，无需重复创建')
  } else {
    await prisma.user.create({
      data: {
        ...defaultVisitorUser
      }
    })
  }
}

main()
  .then(() => {
    console.log('Seed your database successfully!')
  })
  .catch((err) => {
    if (err instanceof Error) {
      console.error(err)
    }
  })
  .finally(() => {
    prisma.$disconnect().catch(() => {})
  })
