import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.any(),
  JWT_SECRET: z.any(),
  PORT: z.any(),
  NODE_ENV: z.any(),
})

export const env = envSchema.parse(process.env)
