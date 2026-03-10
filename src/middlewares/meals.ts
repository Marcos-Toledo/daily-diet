
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { knex } from '../package/knex'

const userParamsSchema = z.object({
  user_id: z.string().optional(),
  meal_id: z.string().optional()
})

export async function validateMealOwnership(request: FastifyRequest, replay: FastifyReply) {
  const { user_id, meal_id } = userParamsSchema.parse(request.params)

  if (!meal_id) {
    return replay.status(400).send({ error: 'Meal IS is required' })
  }

  const meal = await knex('meals').where({
    id: meal_id,
    user_id,
  }).first()

  if (!meal) {
    return replay.status(404).send({ error: 'Meal not found'})
  }
}