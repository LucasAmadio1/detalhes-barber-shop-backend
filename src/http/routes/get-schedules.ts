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
              createdAt: z.date(),
            })
          ),
        },
      },
    },
    async (_, reply) => {
      const { schedules } = await getSchedules()

      return reply.status(200).send(schedules)
    }
  )
}
