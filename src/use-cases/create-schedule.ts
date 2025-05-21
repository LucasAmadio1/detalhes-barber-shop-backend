import { isValid, parse } from 'date-fns'
import { prisma } from '../lib/prisma'

interface CreateScheduleRequest {
  userId: string
  date: string
  time: string
}

export async function createSchedule({
  userId,
  date,
  time,
}: CreateScheduleRequest) {
  const dateTimeString = `${date} ${time}`
  const scheduleAt = parse(dateTimeString, 'dd/MM/yyyy HH:mm', new Date())

  if (scheduleAt < new Date()) {
    throw new Error('You cannot schedule an appointment in the past.')
  }

  if (!isValid(scheduleAt)) {
    throw new Error('Invalid date/time format.')
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  })

  if (!user) {
    throw new Error('User not found!')
  }

  const oneHourBefore = new Date(scheduleAt.getTime() - 60 * 60 * 1000)
  const oneHourAfter = new Date(scheduleAt.getTime() + 60 * 60 * 1000)

  const scheduleConflict = await prisma.schedule.findFirst({
    where: {
      deletedAt: null,
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

  const schedule = await prisma.schedule.create({
    data: {
      userId,
      scheduleAt,
    },
  })

  return { schedule }
}
