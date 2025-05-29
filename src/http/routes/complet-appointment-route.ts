import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { completAppointment } from '../../use-cases/complet-appointment'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const completAppointmentRoute: FastifyPluginAsyncZod = async (app) => {
  app.put(
    '/schedule/:scheduleId/finished',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['schedule'],
        description: 'Finished schedule',
        params: z.object({
          scheduleId: z.string().uuid(),
        }),
        body: z.object({
          value: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { scheduleId } = request.params
      const { value } = request.body

      await completAppointment({ value, scheduleId })

      return reply.status(200).send()
    }
  )
}
