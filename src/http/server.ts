import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '../env'
import { createScheduleRoute } from './routes/create-schedule-route'
import { createUserRoute } from './routes/create-user-route'
import { deleteScheduleRoute } from './routes/delete-schedule-route'
import { getProfileRoute } from './routes/get-profile-route'
import { getSchedulesRoute } from './routes/get-schedules-route'
import { signInRoute } from './routes/sign-in-route'
import { updatedScheduleRoute } from './routes/updated-schedule-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Detalhes Barber Shop',
      version: '0.0.1',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createUserRoute)
app.register(signInRoute)
app.register(createScheduleRoute)
app.register(updatedScheduleRoute)
app.register(deleteScheduleRoute)
app.register(getSchedulesRoute)
app.register(getProfileRoute)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server running! 🙂')
  })
