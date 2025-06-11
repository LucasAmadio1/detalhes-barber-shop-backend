import { prisma } from '../lib/prisma'

interface CanceledScheduleParams {
  scheduleId: string
  userId: string
}

export async function canceledSchedule({
  scheduleId,
  userId,
}: CanceledScheduleParams) {
  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      deletedAt: null,
    },
  })

  if (!schedule) {
    throw new Error('Agendamento não encontrado! tente novamente mais tarde.')
  }

  if (schedule.userId !== userId) {
    throw new Error(
      'O usuário não tem permissão para excluir esse agendamento.'
    )
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
