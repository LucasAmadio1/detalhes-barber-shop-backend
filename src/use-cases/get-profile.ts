import { prisma } from '../lib/prisma'

interface MeProps {
  userId: string
}

export async function getProfile({ userId }: MeProps) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  })

  if (!user) {
    return
  }

  return { user }
}
