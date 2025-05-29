import { prisma } from '../lib/prisma'

interface DeleteScheduleParams {
  scheduleId: string
  userId: string
}

export async function deleteSchedule({
  scheduleId,
  userId,
}: DeleteScheduleParams) {
  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      deletedAt: null,
    },
  })

  if (!schedule) {
    throw new Error('Schedule not found.')
  }

  if (schedule.userId !== userId) {
    throw new Error('User does not have permission to delete this schedule.')
  }

  await prisma.schedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      deletedAt: new Date(),
      status: 'CANCELED',
    },
  })

  return { message: 'sucess' }
}
