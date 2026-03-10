import type { FastifyInstance } from "fastify"
import { randomUUID } from "node:crypto"
import { knex } from '../package/knex'
import { createUserSchema } from '../schemas/users'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, replay) => {
    const { name, email, avatar_url} = createUserSchema.parse(request.body)
    const user = {
      id: randomUUID(),
      name,
      email,
      avatar_url,
    }

    await knex('users').insert(user)

    return replay.status(201).send()
  })
}