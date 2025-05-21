// // import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
// // import { createUser } from '../../use-cases/create-user'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { updatedSchedule } from '../../use-cases/updated-schedule'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const updatedScheduleRoute: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/schedule/:scheduleId',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['schedule'],
        description: 'update schedule',
        body: z.object({
          date: z.string(),
          time: z.string(),
        }),
        params: z.object({
          scheduleId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            scheduleId: z.string().uuid(),
            scheduleAt: z.date(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const { date, time } = request.body

      const { scheduleId } = request.params

      const { schedule } = await updatedSchedule({
        date,
        time,
        userId,
        scheduleId,
      })

      return reply.status(201).send({
        scheduleId: schedule.id,
        scheduleAt: schedule.scheduleAt,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,
      })
    }
  )
}
