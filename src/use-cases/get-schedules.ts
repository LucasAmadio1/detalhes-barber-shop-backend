import { prisma } from '../lib/prisma'

interface GetSchedulesProps {
  page: number
  limit: number
}

export async function getSchedules({
  page = 1,
  limit = 10,
}: GetSchedulesProps) {
  const skip = (page - 1) * limit

  const [schedules, total] = await Promise.all([
    prisma.schedule.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        scheduleAt: true,
        clientName: true,
        clientPhone: true,
        createdAt: true,
        status: true,
        value: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: [
        {
          status: 'asc',
        },
        {
          scheduleAt: 'asc',
        },
      ],
    }),
    prisma.schedule.count(),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data: schedules,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}
