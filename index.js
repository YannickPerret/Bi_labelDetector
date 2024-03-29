const fastify = require('fastify')({ logger: true, level: 'info' })
const cors = require('@fastify/cors')
const LabelDetector = require("./lib/labelDetector");
const { db } = require("./lib/database/database")
const fs = require('fs');
const path = require('path');
const dotenv = require("dotenv");

let dotEnvPath = path.join(__dirname, "..", ".env");

if (!fs.existsSync(dotEnvPath)) {
    dotEnvPath = path.join(__dirname, ".env");
}
dotenv.config({ path: dotEnvPath });

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

try {
    db.createDatabase(process.env.RETHINK_DB).finally(() => {
        db.createTable('images').finally(() => {
            console.log(`\x1b[33m[LABELDETECTOR]\x1b[0m : database ${process.env.RETHINK_DB} and table images created`)
        })
    })
}
catch (e) {
    console.error(e);
}


// Declare a route
fastify.post('/api/analyze', async (request, reply) => {
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
        if (request.body.maxLabel < 1 || request.body.maxLabel > 100) {
            throw "maxLabel must be between 1 and 100"
        }
        if (request.body.minConfidence < 0 || request.body.minConfidence > 100) {
            throw "minConfidence must be between 0 and 100"
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

        if (db.getStatus()) {
            await db.insert('images', { labelModel: data.LabelModelVersion, labels: data.Labels, MaxLabel: maxLabel, MinConfidence: minConfidence, url: url });
        }

        reply.send({ message: 'Image analyzed with success', data: data });
    }
    catch (e) {
        console.error(e);
        reply.status(500).send({ error: e.message });
    }
})

// Declare a route to download SQL Insert file of analyzed images from Rethinkdb
fastify.post('/download', async (request, reply) => {
    try {
        const data = await db.get('images', 'url', request.body.url);
        if (!data) {
            throw new Error("No data found for the provided URL");
        }

        const fileName = 'insert.sql';
        let fileContent = `INSERT INTO images (id, url, labels) VALUES ('${data.id}', '${data.url}', '${JSON.stringify(data.labels)}');\n`;

        reply.header('Content-Disposition', `attachment; filename=${fileName}`);
        reply.header('Content-Type', 'text/plain');
        reply.send(fileContent);
    }
    catch (e) {
        console.error(e);
        reply.status(500).send({ error: e.message });
    }
});

fastify.listen({ port: process.env.LABEL_API_PORT, host: process.env.LABELDETECTOR_BASE_URL }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(`\x1b[33m[LABELDETECTOR]\x1b[0m : server listening on ${fastify.server.address().port}`)
})