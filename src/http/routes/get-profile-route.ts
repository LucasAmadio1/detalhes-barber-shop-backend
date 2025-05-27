import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getProfile } from '../../use-cases/get-profile'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/me',
    {
      onRequest: [authenticateUserHook],
      schema: {
        tags: ['user'],
        description: 'get user profile',
        response: {
          200: z.object({
            id: z.string().uuid(),
            name: z.string(),
            email: z.string().email(),
            phone: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub

      const result = await getProfile({ userId })
      const user = result?.user

      if (!user) {
        throw new Error('User not found!')
      }

      return reply.status(200).send({
        id: user.id,
        email: user.email,
        name: user.name ?? '',
        phone: user.phone,
      })
    }
  )
}
