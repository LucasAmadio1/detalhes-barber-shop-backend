// import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
// import { createUser } from '../../use-cases/create-user'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createSchedule } from '../../use-cases/create-schedule'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const createScheduleRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/schedule',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['schedule'],
        description: 'create schedule',
        body: z.object({
          date: z.string(),
          time: z.string(),
          name: z.string(),
          phone: z.string(),
        }),
        response: {
          201: z.object({
            scheduleId: z.string().uuid(),
            scheduleAt: z.date(),
            createdAt: z.date(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { date, time, name, phone } = request.body

      const { schedule } = await createSchedule({
        date,
        time,
        userId,
        name,
        phone,
      })

      return reply.status(201).send({
        scheduleId: schedule.id,
        scheduleAt: schedule.scheduleAt,
        createdAt: schedule.createdAt,
      })
    }
  )
}
