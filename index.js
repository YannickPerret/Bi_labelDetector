const fastify = require('fastify')({ logger: true })
const cors = require('@fastify/cors')
const LabelDetector = require("./lib/labelDetector");
require("dotenv").config();

const VisionDetector = LabelDetector.createClient({
    cloud:'AWS', region: 
    process.env.AWS_REGION, 
    profile: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
})

// Declare a route
fastify.post('/analyze', async (request, reply) => {
    // reçoit une url aws en entrée et renvoie un json avec les labels et les confidences
    try{
        if (!request.body.url) {
            throw new Error("No url provided");
        }
        else if (!request.body.maxLabel || !request.body.minConfidence) {
            throw new Error("No maxLabels or minConfidence or label provided, using default values");
        }
        const maxLabel = request.body.maxLabel;
        const minConfidence = request.body.minConfidence;

        const data = await VisionDetector.analyze(request.body.url, maxLabel, minConfidence);
        if (data.Labels.length === 0) {
            throw new Error("No labels found");
        }
        reply.send({message: 'Image analyzed with success', data: data});
    
    }
    catch(e){
        console.error(e);
        reply.status(500).send({ error: e.message });
    }
})
  
  // Run the server!
fastify.listen({ port: 3000 }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})