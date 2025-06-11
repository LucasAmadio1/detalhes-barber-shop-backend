import { prisma } from '../lib/prisma'

interface GetUserScheduleProps {
  userId: string
}

export async function getUserSchedule({ userId }: GetUserScheduleProps) {
  const schedules = await prisma.schedule.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    select: {
      id: true,
      scheduleAt: true,
    },
  })

  if (!schedules) {
    throw new Error('Agendamento não encontrado!')
  }

  return schedules
}
