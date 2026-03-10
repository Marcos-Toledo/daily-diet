import type { FastifyInstance } from 'fastify';
import fastify from 'fastify';

const app: FastifyInstance = fastify({
  logger: true
})

app.get('/', () => {
  return 'Daily Diet API'
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