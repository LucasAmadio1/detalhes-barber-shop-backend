import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { createUser } from '../../use-cases/create-user'

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/register',
    {
      schema: {
        tags: ['user'],
        description: 'create user',
        body: z.object({
          email: z.string().email(),
          name: z.string().min(1).optional(),
          password: z.string().min(6).max(15),
        }),
        response: {
          201: z.object({
            id: z.string().uuid(),
            email: z.string().email(),
            name: z.string().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password, name } = request.body

      const user = await createUser({ email, password, name })

      return reply.status(201).send({
        id: user.id,
        email: user.email,
        name: user.name ?? '',
      })
    }
  )
}
