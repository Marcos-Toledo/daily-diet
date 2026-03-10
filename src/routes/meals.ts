import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { validateMealOwnership } from '../middlewares/meals'
import { knex } from '../package/knex'
import { createMealBodySchema, userParamsSchema } from '../schemas/meals'

export async function mealsRoutes(app: FastifyInstance) {

  app.get('/', async (request) => {
    const { user_id } = userParamsSchema.parse(request.query)
    const meals = await knex('meals').where('user_id', user_id)
    
    return { meals }
  })

  app.get('/:meal_id', async (request) => {
    const { meal_id } = userParamsSchema.parse(request.params)

    const meal = await knex('meals').where({
      id: meal_id
    }).first()

    return { meal }
  })

  app.post('/', async (request, replay) => {
    const { name, description, date, datetime, within_diet } = createMealBodySchema.parse(request.body)
    const { user_id } = userParamsSchema.parse(request.query)
    
    const meal = {
      id: randomUUID(),
      name,
      description,
      date,
      datetime,
      within_diet,
      user_id,
    }
    
    await knex('meals').insert(meal)
    
    return replay.status(201).send(meal)
  })

  app.put('/', { preHandler: [validateMealOwnership] }, async (request, replay) => {
    const { user_id, meal_id } = userParamsSchema.parse(request.query)
    const { name, description, date, datetime, within_diet } = createMealBodySchema.parse(request.body)

    await knex('meals').where({
      id: meal_id,
      user_id,
    }).update({
      name,
      description,
      date,
      datetime,
      within_diet,
    })

    return replay.status(204).send()
  })

  app.delete('/', { preHandler: [validateMealOwnership] }, async (request, replay) => {
    const { user_id, meal_id } = userParamsSchema.parse(request.body)

    await knex('meals').where({
      id: meal_id,
      user_id,
    }).del()

    return replay.status(204).send()
  })
}