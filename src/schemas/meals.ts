import { z } from 'zod'

export const createMealBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.iso.date(),
  datetime: z.iso.time(),
  within_diet: z.boolean(),
})

export const userParamsSchema = z.object({
  user_id: z.string().optional(),
  meal_id: z.string().optional()
})