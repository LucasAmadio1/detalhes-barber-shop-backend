import { z } from 'zod'

import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { signIn } from '../../use-cases/sign-in'

export const signInRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/sign-in',
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const { token } = await signIn({ email, password })

      return reply.status(201).send({ token })
    }
  )
}
