const fastify = require('fastify')({ logger: true, level: 'info' })
const cors = require('@fastify/cors')
const LabelDetector = require("./lib/labelDetector");
require("dotenv").config();

const VisionDetector = LabelDetector.createClient({
    cloud: process.env.CLOUD_NAME,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
})

// Declare a route
fastify.post('/analyze', async (request, reply) => {
    // reçoit une url aws en entrée et renvoie un json avec les labels et les confidences
    try {
        if (!request.body.url) {
            throw "No url provided"
        }
        if (!request.body.maxLabel || !request.body.minConfidence) {
            throw "No maxLabels or minConfidence or label provided, using default values"
        }
        if (typeof request.body.maxLabel !== 'number' || typeof request.body.minConfidence !== 'number') {
            throw "maxLabel or minConfidence is not a number"
        }

        const { url, maxLabel, minConfidence } = request.body;

        const response = await fetch(url);
        if (!response.ok) {
            throw `HTTP error! status: ${response.status}`
        }
        const arrayBuffer = await response.arrayBuffer();


        const data = await VisionDetector.analyze(arrayBuffer, maxLabel, minConfidence);
        if (data.Labels.length === 0) {
            throw "No labels found"
        }
        console.log(data, url);
        reply.send({ message: 'Image analyzed with success', data: data });
    }
    catch (e) {
        console.error(e);
        reply.status(500).send({ error: e.message });
    }
})

// Run the server!
fastify.listen({ port: process.env.API_PORT }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }

    console.log(`\x1b[33m[LABELDETECTOR]\x1b[0m : server listening on ${fastify.server.address().port}`)
})