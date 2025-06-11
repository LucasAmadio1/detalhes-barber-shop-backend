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
          email: z.string(),
          name: z.string(),
          password: z.string(),
          phone: z.string(),
        }),
        response: {
          201: z.object({
            id: z.string().uuid(),
            email: z.string(),
            phone: z.string(),
            name: z.string().optional(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password, name, phone } = request.body

      if (!email) {
        throw new Error('O campo e-mail é obrigatório!')
      }

      if (!password) {
        throw new Error('O campo de senha é obrigatório!')
      }

      if (!phone) {
        throw new Error('O campo de celular é obrigatório!')
      }

      const user = await createUser({ email, password, name, phone })

      return reply.status(201).send({
        id: user.id,
        email: user.email,
        name: user.name ?? '',
        phone: user.phone,
      })
    }
  )
}
