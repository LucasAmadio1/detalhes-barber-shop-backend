import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getSchedules } from '../../use-cases/get-schedules'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getSchedulesRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/schedules',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['schedule'],
        description: 'get schedules where deletedAt is null',
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              userId: z.string().uuid(),
              scheduleAt: z.date(),
              status: z.string(),
              value: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
              deletedAt: z.date().nullable(),
              user: z.object({
                id: z.string().uuid(),
                name: z.string(),
                email: z.string().email(),
                phone: z.string(),
              }),
            })
          ),
        },
      },
    },
    async (_, reply) => {
      const schedules = await getSchedules()

      const sanitizedSchedules = schedules.map((schedule) => ({
        ...schedule,
        status: String(schedule.status),
        user: {
          ...schedule.user,
          name: schedule.user.name ?? '',
        },
      }))

      return reply.status(200).send(sanitizedSchedules)
    }
  )
}
