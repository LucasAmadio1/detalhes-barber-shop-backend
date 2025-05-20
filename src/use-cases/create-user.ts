import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'

interface CreateUserRequest {
  email: string
  password: string
  name?: string
}

export async function createUser({ email, name, password }: CreateUserRequest) {
  const userAlreadyExists = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  })

  if (userAlreadyExists) {
    throw new Error('this user already exists')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })

  return user
}
