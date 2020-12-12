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
            let isKeyValid = false;

            let docRef = await db.collection("laboratories").select("private_key").where("address", "==",  laboratory);
            
            console.log('Done checking list of laboratories...');

            await docRef.get().then(function(doc) {
                
                if (!doc.empty) {
                    let hashedPrivateKey = doc.docs[0]._fieldsProto.private_key.stringValue;
                    isKeyValid = bcrypt.compareSync(laboratoryPrivateKey,hashedPrivateKey);
                }
            }).catch(function(error) {
                res.send(401,{
                    message: 'You have provided invalid credentials',
                    error: 'Invalid credentials.'
                });
                return;
            });

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

                let transactionHash = await TransactionHelper.buildTransaction(
                    laboratory,
                    laboratoryPrivateKey,
                    uploadLaboratoryAnalysisResultEncodedABI
                )    
                console.log('Done sending transaction to blockchain...');
                
                console.log('Checking status of transaction.');
    
                let transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
        
                console.log('Done checking status of transaction.');

                if(transactionReceipt.status){
                    res.send(200,{
                        message: 'Done uploading result.',
                        laboratory: laboratory,
                        batchId: batchId
                    });
                    return
                }
                else{
                    res.send(500,{
                        message: 'Result not uploaded successfully.',
                        error: 'Blockchain transaction failed.'
                    });
                    return
                }
            }
            else{
                res.send(401,{
                    message: 'You have provided invalid credentials',
                    error: 'Invalid credentials.'
                });
                return;
            }
            
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