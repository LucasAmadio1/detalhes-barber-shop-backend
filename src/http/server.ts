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
import { canceledScheduleRoute } from './routes/canceled-schedule-route'
import { completAppointmentRoute } from './routes/complet-appointment-route'
import { createScheduleRoute } from './routes/create-schedule-route'
import { createUserRoute } from './routes/create-user-route'
import { getProfileRoute } from './routes/get-profile-route'
import { getScheduleDetailsRoute } from './routes/get-schedule.details'
import { getSchedulesRoute } from './routes/get-schedules-route'
import { getUserScheduleRoute } from './routes/get-user-schedule-route'
import { signInRoute } from './routes/sign-in-route'
import { updatedScheduleRoute } from './routes/updated-schedule-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
  methods: ['*'],
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
app.register(canceledScheduleRoute)
app.register(getSchedulesRoute)
app.register(getProfileRoute)
app.register(getUserScheduleRoute)
app.register(completAppointmentRoute)
app.register(getScheduleDetailsRoute)

app
  .listen({
    port: env.PORT || 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('HTTP server running! 🙂')
  })
