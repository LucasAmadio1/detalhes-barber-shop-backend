import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getScheduleDetails } from '../../use-cases/get-schedule-details'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getScheduleDetailsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/schedule-details/:scheduleId',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['schedule'],
        description: 'Get user schedule details',
        params: z.object({
          scheduleId: z.string(),
        }),
        response: {
          200: z.object({
            id: z.string().uuid(),
            scheduleAt: z.date(),
            status: z.string(),
            value: z.string().nullable(),
            clientName: z.string(),
            clientPhone: z.string(),
            user: z.object({
              email: z.string().email(),
              name: z.string().nullable(),
              phone: z.string(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { scheduleId } = await request.params

      const scheduleDetails = await getScheduleDetails({ scheduleId })

      return reply.status(200).send({
        value: scheduleDetails.value,
        id: scheduleDetails.id,
        scheduleAt: scheduleDetails.scheduleAt,
        status: scheduleDetails.status,
        clientName: scheduleDetails.clientName || '',
        clientPhone: scheduleDetails.clientPhone || '',
        user: {
          email: scheduleDetails.user.email,
          name: scheduleDetails.user.name,
          phone: scheduleDetails.user.phone,
        },
      })
    }
  )
}
