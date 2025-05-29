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
    throw new Error('This appointment does not exist or is canceled.')
  }

  if (Number(value) <= 0) {
    throw new Error('Value must be greater than zero and not empty')
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
