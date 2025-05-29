import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getUserSchedule } from '../../use-cases/get-user-schedule'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getUserScheduleRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/user-schedules',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['schedule'],
        description: 'get user schedules',
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              scheduleAt: z.date(),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const userSchedule = await getUserSchedule({ userId })

      return reply.status(200).send(userSchedule)
    }
  )
}
