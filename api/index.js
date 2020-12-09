const restify = require('restify')
const routerMagic = require('restify-router-magic')
const corsMiddleware = require('restify-cors-middleware')
const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

global.firebase = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Load configuration files
require('dotenv').config({ path: 'config/.env' })

global.contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "value",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "name": "LabAnalysisResultUploaded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "supplier",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "name": "MeatProductRegistered",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "supplier",
                "type": "address"
            }
        ],
        "name": "registerMeatProduct",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "userType",
                "type": "uint256"
            }
        ],
        "name": "registerUser",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "value",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "name": "SanitaryInspectionResultUploaded",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "result",
                "type": "bytes32"
            }
        ],
        "name": "setLabAnalysisResult",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "result",
                "type": "bytes32"
            }
        ],
        "name": "setSanitaryInspectionResult",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            }
        ],
        "name": "getLabAnalysisResult",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            }
        ],
        "name": "getLabAnalysisResultStatus",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            }
        ],
        "name": "getSanitaryInspectionResult",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "batchId",
                "type": "bytes32"
            }
        ],
        "name": "getSanitaryInspectionStatus",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]


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