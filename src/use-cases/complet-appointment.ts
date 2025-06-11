import { prisma } from '../lib/prisma'

interface CompletAppointmentProps {
  scheduleId: string
  value: string
}

export async function completAppointment({
  value,
  scheduleId,
}: CompletAppointmentProps) {
  const schedule = await prisma.schedule.findFirst({
    where: {
      id: scheduleId,
      deletedAt: null,
    },
  })

  if (!schedule) {
    throw new Error('Este agendamento não existe ou foi cancelado.')
  }

  if (Number(value) <= 0) {
    throw new Error('O valor deve ser maior que zero.')
  }

  await prisma.schedule.update({
    where: {
      id: scheduleId,
    },
    data: {
      status: 'COMPLETED',
      value: value,
      deletedAt: new Date(),
    },
  })

  return { message: 'success' }
}
