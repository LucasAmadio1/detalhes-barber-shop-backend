import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'

interface CreateUserRequest {
  email: string
  password: string
  name?: string
  phone: string
}

export async function createUser({
  email,
  name,
  password,
  phone,
}: CreateUserRequest) {
  if (!email) {
    throw new Error('O campo e-mail é obrigatório!')
  }

  if (!password) {
    throw new Error('O campo de senha é obrigatório!')
  }

  if (!phone) {
    throw new Error('O campo de celular é obrigatório!')
  }

  const userAlreadyExists = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  })

  if (userAlreadyExists) {
    throw new Error('Este usuário já existe.')
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phone,
    },
  })

  return user
}
