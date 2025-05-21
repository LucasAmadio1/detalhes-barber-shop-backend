import { isValid, parse } from 'date-fns'
import { prisma } from '../lib/prisma'

interface UpdateScheduleRequest {
  scheduleId: string
  userId: string
  date: string
  time: string
}

export async function updatedSchedule({
  date,
  scheduleId,
  time,
  userId,
}: UpdateScheduleRequest) {
  const dateTimeString = `${date} ${time}`
  const scheduleAt = parse(dateTimeString, 'dd/MM/yyyy HH:mm', new Date())

  if (!isValid(scheduleAt)) {
    throw new Error('Invalid date/time format.')
  }

  const existingSchedule = await prisma.schedule.findUnique({
    where: {
      id: scheduleId,
      deletedAt: null,
    },
  })

  if (!existingSchedule) {
    throw new Error('schedule not found.')
  }

  if (existingSchedule.userId !== userId) {
    throw new Error('User does not have permission to update this schedule.')
  }

  const oneHourBefore = new Date(scheduleAt.getTime() - 60 * 60 * 1000)
  const oneHourAfter = new Date(scheduleAt.getTime() + 60 * 60 * 1000)

  const scheduleConflict = await prisma.schedule.findFirst({
    where: {
      deletedAt: null,
      id: { not: scheduleId },
      scheduleAt: {
        gte: oneHourBefore,
        lt: oneHourAfter,
      },
    },
  })

  if (scheduleConflict) {
    throw new Error(
      'There is already an appointment within 1 hour of this time.'
    )
  }

  const schedule = await prisma.schedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      scheduleAt: scheduleAt,
    },
  })

  return { schedule }
}
