import { prisma } from '../lib/prisma'

export async function getSchedules() {
  const schedules = await prisma.schedule.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: {
      scheduleAt: 'asc',
    },
  })

  return schedules
}
