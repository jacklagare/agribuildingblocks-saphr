module.exports = {

    post: async (req,res,next) => {
        const Accounts = require('web3-eth-accounts');
        const accounts = new Accounts(process.env.WEB3_PROVIDER_URL);
        const Web3 = require('web3');
        const Tx = require('ethereumjs-tx');
        const bcrypt = require('bcrypt');
        const TransactionHelper = require('../../../helpers/TransactionHelper');
        const { v4: uuidv4 } = require('uuid');
        const keccak = require('keccak')
        
        let batchId = uuidv4();
        
        let batchIdHash = '0x' + keccak('keccak256').update(batchId).digest('hex')

        try{
           
            // Connect to chain
            const web3 = new Web3(new Web3.providers.HttpProvider(process.env.WEB3_PROVIDER_URL));
            const smartContract = new web3.eth.Contract(contractABI,process.env.ETH_ADDRESS);
            
            const db = firebase.firestore()
            
            let supplier = req.body.supplierAddress;
            let supplierPrivateKey = req.body.supplierKey;

            let supplierPrivateKeyEncoded = bcrypt.hashSync(supplierPrivateKey,10);

            console.log('Checking list of suppliers...');
            let suppliers = db.collectionGroup('suppliers')
                .where('address', '==', supplier);
            
                console.log('Done checking list of suppliers...');

            let result = await suppliers.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {

                    if(!querySnapshot.empty){
                        let hashedPrivateKey = doc._fieldsProto.private_key.stringValue;
                        let isKeyValid = bcrypt.compareSync(supplierPrivateKey,hashedPrivateKey);
                        console.log(isKeyValid);
                        if(isKeyValid){

                            let registerSupplierEncodedABI = smartContract
                                .methods
                                .registerMeatProduct(batchIdHash)
                                .encodeABI();
                            console.log('Sending transaction to blockchain...');
                            let transactionHash = TransactionHelper.buildTransaction(
                                supplier,
                                supplierPrivateKey,
                                registerSupplierEncodedABI
                            )    
                            console.log('Done sending transaction to blockchain...');

                            res.send(200,{
                                message: 'Meat product successfully registered.',
                                supplier: supplier,
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
                message: 'Meat product registration failed',
                error: err
            });
            return
        }
    },
}