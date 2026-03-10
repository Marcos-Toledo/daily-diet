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

  app.get('/summary', async (request) => {
    const { user_id } = userParamsSchema.parse(request.query)
    const meals = await knex('meals').where('user_id', user_id)
    
    const bestSequence = meals.reduce((acc, meal) => {
      if (meal.within_diet === 1) {
        acc.current++
        acc.best = acc.current > acc.best ? acc.current : acc.best
      } else {
        acc.current = 0
      }
      return acc
    }, { best: 0, current: 0 }).best

    return {
      total_meals: meals.length,
      total_meals_in_diet: meals.filter(meal => meal.within_diet).length,
      total_meals_out_of_diet: meals.filter(meal => !meal.within_diet).length,
      best_sequence: bestSequence,
    }
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