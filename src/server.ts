import type { FastifyInstance } from 'fastify'
import fastify from 'fastify'
import { mealsRoutes } from './routes/meals'
import { usersRoutes } from './routes/users'

const app: FastifyInstance = fastify({
  logger: true
})

app.register(usersRoutes, {
  prefix: '/users'
})

app.register(mealsRoutes, {
  prefix: '/meals'
})

try {
  app.listen({
    port: 3333,
  }).then(() => {
    console.log('Server running on http://localhost:3333')
  })
} catch (error) {
  console.log(error)
  process.exit(1)
}