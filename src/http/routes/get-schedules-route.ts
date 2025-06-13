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
        description: 'Get schedules with pagination (where deletedAt is null)',
        querystring: z.object({
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(100).default(10),
        }),
        response: {
          200: z.object({
            data: z.array(
              z.object({
                value: z.string().nullable(),
                status: z.string(),
                id: z.string().uuid(),
                scheduleAt: z.date(),
                clientName: z.string().nullable(),
                clientPhone: z.string().nullable(),
                createdAt: z.date(),
                user: z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  email: z.string().email(),
                  phone: z.string(),
                }),
              })
            ),
            pagination: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
              totalPages: z.number(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query

      const { data, pagination } = await getSchedules({ page, limit })

      const sanitizedSchedules = data.map((schedule) => ({
        ...schedule,
        user: {
          ...schedule.user,
          name: schedule.user.name ?? '', // forçando string
        },
      }))

      return reply.status(200).send({
        data: sanitizedSchedules,
        pagination,
      })
    }
  )
}
