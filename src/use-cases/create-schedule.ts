import { isValid, parse } from 'date-fns'
import { prisma } from '../lib/prisma'
interface CreateScheduleRequest {
  userId: string
  date: string
  time: string
  name: string
  phone: string
}

export async function createSchedule({
  name,
  userId,
  date,
  time,
  phone,
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

  if (!name) {
    throw new Error('É necessário informar o nome do cliente.')
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
      userId: userId,
      scheduleAt,
      status: 'SCHEDULED',
      clientName: name,
      clientPhone: phone,
    },
  })

  return { schedule }
}
