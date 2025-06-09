import { prisma } from '../lib/prisma'

interface GetUserScheduleDetailsProps {
  scheduleId: string
}

export async function getScheduleDetails({
  scheduleId,
}: GetUserScheduleDetailsProps) {
  const schedule = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
    },
    select: {
      id: true,
      status: true,
      scheduleAt: true,
      value: true,
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  })

  if (!schedule) {
    throw new Error('Schedule not found!')
  }

  return schedule
}
