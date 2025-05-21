import { prisma } from '../lib/prisma'

export async function getSchedules() {
  const schedules = await prisma.schedule.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      userId: true,
      scheduleAt: true,
      createdAt: true,
    },
  })

  return { schedules }
}
