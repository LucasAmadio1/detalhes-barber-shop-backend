import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.any(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number(),
  NODE_ENV: z.string(),
})

export const env = envSchema.parse(process.env)
