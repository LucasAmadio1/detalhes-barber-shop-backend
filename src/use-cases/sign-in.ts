import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { authenticatedUser } from '../modules/auth'

interface signInRequest {
  email: string
  password: string
}

export async function signIn({ email, password }: signInRequest) {
  const user = await prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials')
  }

  const token = await authenticatedUser(user.id)

  return { token }
}
