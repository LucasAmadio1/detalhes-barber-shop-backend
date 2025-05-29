// // import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { canceledSchedule } from '../../use-cases/canceled-schedule'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const canceledScheduleRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/schedule/:scheduleId',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['schedule'],
        description: 'update schedule',
        params: z.object({
          scheduleId: z.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const { scheduleId } = request.params

      await canceledSchedule({
        userId,
        scheduleId,
      })

      return reply.status(201).send()
    }
  )
}
