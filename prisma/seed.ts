import { hash } from '@node-rs/bcrypt'
import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_SUPER_ADMIN_USERNAME = 'admin'
const SEED_SUPER_ADMIN_PASSWORD = '123456'

async function main() {
  // 创建超级管理员
  const defaultUser: Prisma.UserCreateInput = {
    username: SEED_SUPER_ADMIN_USERNAME,
    password: await hash(SEED_SUPER_ADMIN_PASSWORD, 10),
    email: 'recall4056@gmail.com',
    nickName: 'Bruce',
    firstName: 'Bruce',
    lastName: 'Song',
    avatarUrl: 'https://avatars.githubusercontent.com/u/62941121?v=4',
    country: 'China',
    province: 'Jiangsu',
    city: 'Suzhou',
    biography: 'Author of Nest TypeScript Starter Template',
    enabled: true,
    builtIn: true
  }

  const superAdmin = await prisma.user.findUnique({
    where: {
      username: SEED_SUPER_ADMIN_USERNAME
    }
  })

  if (superAdmin) {
    console.log('超级管理员已存在，请勿重复创建')
    return
  }

  await prisma.user.create({
    data: {
      ...defaultUser
    }
  })
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
