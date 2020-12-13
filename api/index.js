const restify = require('restify')
const routerMagic = require('restify-router-magic')
const corsMiddleware = require('restify-cors-middleware')
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

// Load configuration files
require('dotenv').config({ path: 'config/.env' })

// Initialize Firebase object
global.firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Initialize value of the smart contract ABI
global.contractABI = require('./config/contractABI.json');

let server = restify.createServer();

server.use(
	restify.plugins.queryParser({
		mapParams: true
	})
)

server.use(
	restify.plugins.bodyParser({
		mapParams: true
	})
)

// Configure CORS

const cors = corsMiddleware({
	origins: ['*'],
	allowHeaders: ['Authorization'],
	exposeHeaders: ['Authorization']
})

server.pre(cors.preflight)
server.use(cors.actual)


// Load router

routerMagic(server, [{ indexWithSlash: 'never' }])

// Start server
server.listen(8085, function() {
    console.log('Server Running...');
})