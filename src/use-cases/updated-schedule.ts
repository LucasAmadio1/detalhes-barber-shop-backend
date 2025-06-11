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

  if (scheduleAt < new Date()) {
    throw new Error('You cannot schedule an appointment in the past.')
  }

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
    throw new Error('Agendamento não encontrado!')
  }

  if (existingSchedule.userId !== userId) {
    throw new Error(
      'O usuário não tem permissão para atualizar este agendamento.'
    )
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
    throw new Error('Já existe um compromisso dentro de 1 hora deste horário.')
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
