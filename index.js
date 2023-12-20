const fastify = require('fastify')({ logger: true })
const cors = require('@fastify/cors')
require("dotenv").config();


fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
})

// Declare a route
fastify.get('/analyze', function handler (request, reply) {
    reply.send({ hello: 'world' })
  })
  
  // Run the server!
fastify.listen({ port: 3000 }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})