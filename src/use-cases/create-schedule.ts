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

  scheduleAt.setHours(scheduleAt.getHours() + 3)

  if (scheduleAt < new Date()) {
    throw new Error(
      'Não é possível agendar no passado. por gentileza, escolha outra data.'
    )
  }

  if (!isValid(scheduleAt)) {
    throw new Error('Formato de data/hora inválido.')
  }

  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  })

  if (!user) {
    throw new Error('Usuário não encontrado.')
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
      'Há um agendamento dentro deste horário. Por gentileza, escolha outro horário.'
    )
  }

  const schedule = await prisma.schedule.create({
    data: {
      userId,
      scheduleAt,
      status: 'SCHEDULED',
    },
  })

  return { schedule }
}
