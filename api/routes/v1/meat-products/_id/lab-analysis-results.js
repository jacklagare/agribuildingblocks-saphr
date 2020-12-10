module.exports = {
    get: async (req,res,next) => {
        const Web3 = require('web3');
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL));
        
        const smartContract = new web3.eth.Contract(contractABI,process.env.CONTRACT_ADDRESS);
        const keccak = require('keccak')

        try{
            let batchId = req.params.id;
            let batchIdHash = '0x' + keccak('keccak256').update(batchId).digest('hex');

            let status = await smartContract
                .methods
                .getLabAnalysisResultStatus(batchIdHash)
                .call({from: process.env.CONTRACT_ADDRESS})

                res.send(200,{
                    'message': 'Success',
                    'result': status
                });
                return;

        }
        catch (err){
            console.log(err);
            res.send(500);
            return;
        }
    },
    
    post: async (req,res,next) => {
        const Accounts = require('web3-eth-accounts');
        const accounts = new Accounts(process.env.WEB3_PROVIDER_URL);
        const Web3 = require('web3');
        const Tx = require('ethereumjs-tx');
        const bcrypt = require('bcrypt');
        const TransactionHelper = require('../../../../helpers/TransactionHelper');
        const keccak = require('keccak')
        
        try{
           
            // Connect to chain
            const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL));
            const smartContract = new web3.eth.Contract(contractABI,process.env.ETH_ADDRESS);
            
            const db = firebase.firestore()
            
            let laboratory = req.body.laboratoryAddress;
            let laboratoryPrivateKey = req.body.laboratoryKey;
            let passed = req.body.passed;
            let batchId = req.params.id;

            let laboratoryPrivateKeyEncoded = bcrypt.hashSync(laboratoryPrivateKey,10);

            console.log('Checking list of laboratories...');
            let laboratories = db.collectionGroup('laboratories')
                .where('address', '==', laboratory);
            
                console.log('Done checking list of laboratories...');

            let result = await laboratories.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {

                    if(!querySnapshot.empty){
                        let hashedPrivateKey = doc._fieldsProto.private_key.stringValue;
                        let isKeyValid = bcrypt.compareSync(laboratoryPrivateKey,hashedPrivateKey);
                        
                        if(isKeyValid){
                            
                            let batchIdHash = '0x' + keccak('keccak256').update(batchId).digest('hex');
                            
                            let resultsJSON = {
                                laboratory: laboratory,
                                analysisTimestamp: Date.now(),
                                result: passed
                            }

                            let resultsHash = '0x' + keccak('keccak256').update(JSON.stringify(resultsJSON)).digest('hex');

                            let uploadLaboratoryAnalysisResultEncodedABI = smartContract
                                .methods
                                .setLabAnalysisResult(batchIdHash,resultsHash,passed)
                                .encodeABI();
                            console.log('Sending transaction to blockchain...');
                            let transactionHash = TransactionHelper.buildTransaction(
                                laboratory,
                                laboratoryPrivateKey,
                                uploadLaboratoryAnalysisResultEncodedABI
                            )    
                            console.log('Done sending transaction to blockchain...');

                            res.send(200,{
                                message: 'Done uploading result.',
                                laboratory: laboratory,
                                batchId: batchId
                            });
                            return
                        }
                        else{
                            res.send(401,'Invalid credentials supplied.');
                            return;
                        }
                    }

                    else {
                        res.send(401,'Invalid credentials supplied.');
                        return;
                    }

                    
                });
            });
        }
        catch(err){
            console.log(err)
            res.send(500,{
                message: 'Failed to upload result.',
                error: err
            });
            return
        }
    },
}